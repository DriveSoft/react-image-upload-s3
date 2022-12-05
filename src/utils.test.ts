import { fetchUrlSign } from "./utils";

const s3Responce = '{"url": "https://bucketname.s3.amazonaws.com/", "fields": {"acl": "public-read", "Content-Type": "image/jpeg", "key": "media/text.jpg", "x-amz-algorithm": "AWS4-HMAC-SHA256", "x-amz-credential": "*****/*****/eu-central-1/s3/aws4_request", "x-amz-date": "20221202T115208Z", "policy": "***********", "x-amz-signature": "********************"}}'

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(s3Responce),
    ok: true,
  }),
) as jest.Mock;

test("getting signed url from AWS S3", async () => {
    const signedUrl = await fetchUrlSign('http://domain.com/signedUrl/', "test.jpg");
    expect(signedUrl.fields.key).toBe('media/text.jpg');
});