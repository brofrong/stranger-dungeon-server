export class EventEmitter<T> {
  public events: Record<string, ((params: T) => void)[]> = {};

  constructor() {}

  on(name: string, listener: (params: T) => void) {
    if (!this.events[name]) {
      this.events[name] = [];
    }

    this.events[name].push(listener);
  }

  removeListener(name: string, listenerToRemove: (params: T) => void) {
    if (!this.events[name]) {
      return console.error(
        `Can't remove a listener. Event "${name}" doesn't exits.`
      );
    }

    const filterListeners = (listener: (params: T) => void) =>
      listener !== listenerToRemove;

    this.events[name] = this.events[name].filter(filterListeners);
  }

  emit(name: string, data: T) {
    this.events[name]?.forEach((callback) => callback(data));
  }
}
