import { UrlsanitizePipe } from './urlsanitize.pipe';

describe('UrlsanitizePipe', () => {
  it('create an instance', () => {
    const pipe = new UrlsanitizePipe();
    expect(pipe).toBeTruthy();
  });
});
