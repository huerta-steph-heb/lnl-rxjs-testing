export const getMockedInstance = <T>(module: string, name: string): jest.Mocked<T> => {
  return new (jest.createMockFromModule(module)[name])();
};
