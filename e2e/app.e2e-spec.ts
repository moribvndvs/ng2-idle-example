import { AotTestPage } from './app.po';

describe('aot-test App', function() {
  let page: AotTestPage;

  beforeEach(() => {
    page = new AotTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
