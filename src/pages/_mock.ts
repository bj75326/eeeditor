import { Request, Response } from 'express';

export default {
  'GET /api/draft': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        status: 'ok',

        title: '测试标题',
        content: {
          entityMap: {},
          blocks: [
            {
              key: '9gm3s',
              text:
                'Cillum cupidatat cupidatat nulla consectetur aliquip voluptate commodo. Veniam Lorem consectetur ipsum Lorem adipisicing consequat eu amet. Consequat ad culpa dolore Lorem in ipsum tempor sint in. Anim elit exercitation amet veniam ullamco voluptate dolore Lorem ut irure. Dolor officia laboris tempor adipisicing tempor voluptate qui commodo ad. Fugiat consectetur excepteur commodo reprehenderit ex reprehenderit aute ad. Cupidatat velit labore voluptate et proident qui commodo.',
              type: 'unstyled',
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: {},
            },
            {
              key: 'e23a8',
              text:
                'Commodo minim adipisicing pariatur duis pariatur nostrud aliqua fugiat occaecat. Commodo enim cillum culpa nulla eiusmod consectetur. Occaecat eiusmod eiusmod ad est eu enim esse incididunt.',
              type: 'unstyled',
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: {},
            },
          ],
        },
      });
    }, 1000);
  },
  'POST /api/sync': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        status: 'ok',
      });
    }, 1000);
  },
};
