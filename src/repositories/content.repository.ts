import { AwsClient } from 'aws4fetch';

type PublishedSite = { site: string; documents: Record<string, unknown> };
let documents: Record<string, unknown> | null = null;
let identityId: string | undefined;
let credentials: { accessKeyId: string; secretAccessKey: string; sessionToken: string; expiresAt: number } | undefined;

const url = (import.meta.env.VITE_PUBLIC_API_URL || 'https://public-api.tsuru.jcampos.dev').replace(/\/+$/, '');
const pool = import.meta.env.VITE_PUBLIC_IDENTITY_POOL_ID || '';
const region = import.meta.env.VITE_AWS_REGION || pool.split(':')[0];

async function identityCall<T>(target: string, body: unknown): Promise<T> {
  const response = await fetch(`https://cognito-identity.${region}.amazonaws.com/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-amz-json-1.1', 'X-Amz-Target': `AWSCognitoIdentityService.${target}` },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`Guest credentials failed (${response.status})`);
  return response.json() as Promise<T>;
}

async function guest() {
  if (credentials && credentials.expiresAt > Date.now() + 60_000) return credentials;
  identityId ||= (await identityCall<{ IdentityId: string }>('GetId', { IdentityPoolId: pool })).IdentityId;
  const response = await identityCall<{ Credentials: { AccessKeyId: string; SecretKey: string; SessionToken: string; Expiration: number } }>(
    'GetCredentialsForIdentity', { IdentityId: identityId });
  credentials = { accessKeyId: response.Credentials.AccessKeyId, secretAccessKey: response.Credentials.SecretKey,
    sessionToken: response.Credentials.SessionToken, expiresAt: response.Credentials.Expiration * 1000 };
  return credentials;
}

export async function getPublicJson<T>(path: string): Promise<T> {
  if (!pool || !region) throw new Error('Public API identity pool is not configured');
  const aws = new AwsClient({ ...await guest(), service: 'execute-api', region });
  const response = await aws.fetch(`${url}${path}`, { method: 'GET' });
  if (!response.ok) throw new Error(`Public API returned ${response.status}`);
  return response.json() as Promise<T>;
}

export async function loadPublishedContent(): Promise<void> {
  if (!pool || !region) throw new Error('Public content identity pool is not configured');
  const aws = new AwsClient({ ...await guest(), service: 'execute-api', region });
  const response = await aws.fetch(`${url}/api/public/content/landing`, { method: 'GET' });
  if (!response.ok) throw new Error(`Public content API returned ${response.status}`);
  const site = await response.json() as PublishedSite;
  if (site.site !== 'landing' || !site.documents || !Object.keys(site.documents).length) {
    throw new Error('Public content API returned no landing documents');
  }
  documents = site.documents;
}

export async function getPublishedBlogId(slug: string): Promise<string> {
  if (!pool || !region) throw new Error('Public content identity pool is not configured');
  const aws = new AwsClient({ ...await guest(), service: 'execute-api', region });
  const response = await aws.fetch(`${url}/api/public/blog/posts/${encodeURIComponent(slug)}`, { method: 'GET' });
  if (!response.ok) throw new Error(`Public blog API returned ${response.status}`);
  const post = await response.json() as { id?: string };
  if (!post.id) throw new Error('Public blog API returned no post ID');
  return post.id;
}

export function getContent<T>(key: string): T {
  if (!documents || !(key in documents)) throw new Error(`Published content unavailable: ${key}`);
  return documents[key] as T;
}
