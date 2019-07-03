'use strict';

import * as T from 'terrific';
import $ from 'jquery';

/**
 * Todo App module implementation.
 *
 * @author Semhar Sium <semhar.sium@namics.com>
 */

// const selectors = { button: '.js-todo-app__button' };
// const stateClasses = { disabled: 'state-todo-app--disabled' };

T.Module.TodoApp = T.createModule({
	start(resolve) {
		const $ctx = $(this._ctx);

		resolve();
	},
});
