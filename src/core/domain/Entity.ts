export abstract class Entity<T> {
  public props: T;

  constructor(props: T) {
    this.props = props;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public toDisplay() {}
}
