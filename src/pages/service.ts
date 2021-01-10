import { request } from 'umi';
import { RawDraftContentBlock } from '@/components/eeeditor';

const fastmock =
  'https://www.fastmock.site/mock/029bbee97e9b87410f811b89efa8d05b/eeeditor';

export async function getDraft(params: {
  draftId: string;
  locale: 'zh-CN' | 'en-US';
}) {
  return request(
    `${fastmock}/api/draft?draftId=${params.draftId}&locale=${params.locale}`,
  );
}

export async function syncContent(params: {
  draftId: string;
  content: RawDraftContentBlock;
}) {
  return request(`${fastmock}/api/sync`, {
    method: 'POST',
    data: params,
  });
}

export async function syncTitle(params: { draftId: string; title: string }) {
  return request(`${fastmock}/api/sync/title`, {
    method: 'POST',
    data: params,
  });
}
