export abstract class Entity<T> {
  public props: T;

  constructor(props) {
    this.props = props;
  }
}
