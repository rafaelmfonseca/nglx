import { Observable } from 'rxjs';

import createStore from '../lib/createStore';

describe('createStore', () => {
    it('should exposes the store', async () => {
        const store = createStore({});

        expect(store.length).toBe(3);
        expect(store[0]).toBeInstanceOf(Function);
        expect(store[1]).toBeInstanceOf(Function);
        expect(store[2]).toBeInstanceOf(Observable);
    });

    it('should subscribe to the state', async () => {
        const [, , state$] = createStore('hello world!');

        state$.subscribe((state) => {
            expect(state).toBe('hello world!');
        });
    });

    it('should set a new state', async () => {
        const [getState, setState] = createStore({ x: 20 });

        expect(getState()).toEqual({ x: 20 });

        setState({ x: 30 });

        expect(getState()).toEqual({ x: 30 });
    });

    it('should set a new state using current state', async () => {
        const [getState, setState] = createStore({ x: 20 });

        setState((currentState) => ({ ...currentState, y: 15 }));

        expect(getState()).toEqual({ x: 20, y: 15 });
    });

    it('should not freeze state', async () => {
        const person = { x: 0, y: 0 };

        const [getState, , state$] = createStore(person);

        person.x = 10;
        person.y = 20;

        expect(getState()).toBe(person);
        expect(getState()).toEqual({ x: 10, y: 20 });

        person.x = 30;
        person.y = 40;

        state$.subscribe((state) => {
            expect(state).toBe(person);
            expect(state).toEqual({ x: 30, y: 40 });
        });
    });
});
