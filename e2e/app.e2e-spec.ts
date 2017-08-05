import { Aodh2017Page } from './app.po';

describe('aodh2017 App', () => {
  let page: Aodh2017Page;

  beforeEach(() => {
    page = new Aodh2017Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
