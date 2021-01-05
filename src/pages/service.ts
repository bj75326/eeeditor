import { request } from 'umi';

const fastmock =
  'https://www.fastmock.site/mock/029bbee97e9b87410f811b89efa8d05b/eeeditor';

export async function getDraft(params: { draftId: string }) {
  return request(`${fastmock}/api/draft?draftId=${params.draftId}`);
}

export async function syncDraft(params: { draftId: string }) {
  return request(`${fastmock}/api/sync`, {
    method: 'POST',
  });
}
