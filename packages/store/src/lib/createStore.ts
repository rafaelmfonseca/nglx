import { BehaviorSubject, Observable } from 'rxjs';
import { isFunction } from './internal/util/isFunction';

type StateSetter<S> = (newState: ((state: Readonly<S>) => S) | S) => void;
type StateGetter<S> = () => S;

type Store<S> = [StateGetter<S>, StateSetter<S>, Observable<S>];

/**
 * Store for managing any type of data.
 *
 * @param initialState
 * @returns
 */
export default function createStore<S>(initialState: S): Store<S> {
    const state$ = new BehaviorSubject(initialState);
    let currentState = initialState;

    /**
     * Access the store value.
     *
     * @returns The current store state.
     */
    function getState(): S {
        return currentState;
    }

    /**
     * Sets a new state.
     *
     * @param newState A object representing the new state.
     */
    function setState(newState: ((state: Readonly<S>) => S) | S): void {
        if (isFunction(newState)) {
            const _newState = newState(currentState);
            state$.next((currentState = _newState));
        } else {
            state$.next((currentState = newState));
        }
    }

    return [getState, setState, state$];
}
