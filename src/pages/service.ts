import { request } from 'umi';

export async function getDraft(params: { draftId: string }) {
  return request(`/api/draft?draftId=${params.draftId}`);
}

export async function syncDraft(params: { draftId: string }) {
  return request(`/api/`);
}
