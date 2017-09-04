import { QuickEntryPage } from './app.po';

describe('quick-entry App', () => {
  let page: QuickEntryPage;

  beforeEach(() => {
    page = new QuickEntryPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
