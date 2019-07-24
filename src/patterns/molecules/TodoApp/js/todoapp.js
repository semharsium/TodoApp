'use strict';

import * as T from 'terrific';
import $ from 'jquery';

/**
 * Todo App module implementation.
 *
 * @author Semhar Sium <semhar.sium@namics.com>
 */

const selectors = {
	button: '.js-todo-app__button',
	createFormBtn: '.js-show-create-form',
	appContainer: '.js-todo-content',
	overlay: '.js-overlay',
	closeButton: '.js-close-button',
	btn: '.js-btn',
	itemTime: '.js-item-time',
	time: '.js-time',
	itemName: '.js-item-name',
	itemTitle: '.js-item-title',
	itemDescription: '.js-item-description',
	description: '.js-description',
	finishedCheckbox: '.js-finished-checkbox',
	itemEdit: '.js-item-edit',
	importanceSpan: '.js-importance-span',
	importance: '.js-importance',
};
// const stateClasses = { disabled: 'state-todo-app--disabled' };

T.Module.TodoApp = T.createModule({
	start(resolve) {
		const $ctx = $(this._ctx);
		const $createFormBtn = $ctx.find(selectors.createFormBtn);
		const $appContainer = $ctx.find(selectors.appContainer);
		const $overlay = $ctx.find(selectors.overlay);
		const $closeButton = $ctx.find(selectors.closeButton);
		const $btn = $ctx.find(selectors.btn);
		const $itemTime = $ctx.find(selectors.itemTime);
		const $time = $ctx.find(selectors.time);
		const $itemName = $ctx.find(selectors.itemName);
		const $itemTitle = $ctx.find(selectors.itemTitle);
		const $itemDescription = $ctx.find(selectors.itemDescription);
		const $description = $ctx.find(selectors.description);
		const $finishedCheckbox = $ctx.find(selectors.finishedCheckbox);
		const $itemEdit = $ctx.find(selectors.itemEdit);
		const $importanceSpan = $ctx.find(selectors.importanceSpan);
		//const $importance = $ctx.find(selectors.importance);
		const typeNametext = `text-${$ctx.data('t-id')}`; //save the text in typeNametext

		//save the value on local server, can use the type or name of the input
		$time.text(localStorage.getItem('date'));
		$itemTitle.text(localStorage.getItem(typeNametext));
		// $itemTitle.text(localStorage.getItem( 'text-' + $ctx.data('t-id')));
		$description.text(localStorage.getItem('textarea'));
		$finishedCheckbox.prop('checked', localStorage.getItem('finished'));

		$createFormBtn.on('click', () => {
			$appContainer.addClass('active');
			$overlay.addClass('active');
		});

		$closeButton.on('click', () => {
			$appContainer.removeClass('active');
			$overlay.removeClass('active');
		});

		$overlay.on('click', () => {
			$appContainer.removeClass('active');
			$overlay.removeClass('active');
		});

		$btn.on('click', (event) => {
			event.preventDefault();

			const timeValue = $itemTime.val();
			const nameValue = $itemName.val();
			const descriptionValue = $itemDescription.val();
			const importanceValue = $importanceSpan.val();

			if (!timeValue || !nameValue || !descriptionValue) {
				// eslint-disable-next-line no-alert
				alert('Bitte alle Felder ausfüllen');
			} else {
				localStorage.setItem('date', timeValue);
				localStorage.setItem('textarea', descriptionValue);
				localStorage.setItem(typeNametext, nameValue);
				localStorage.setItem('rating', importanceValue);

				$time.text(timeValue);
				$itemTitle.text(nameValue);
				$description.text(descriptionValue);

				$appContainer.removeClass('active');
				$overlay.removeClass('active');
			}
		});

		$itemName.on('change', (event) => {
			localStorage.setItem(typeNametext, $(event.target).val()); //$(event.target) means $itemName,typeNametext= `text-${$ctx.data('t-id')}`
		});

		$itemDescription.on('change', (event) => {
			localStorage.setItem('textarea', $(event.target).val());
		});

		$itemTime.on('change', (event) => {
			localStorage.setItem('date', $(event.target).val());
		});

		$finishedCheckbox.on('change', (e) => {
			if ($(e.currentTarget).is(':checked')) {
				localStorage.setItem('finished', true);
			} else {
				localStorage.removeItem('finished');
			}
		});

		$itemEdit.on('click', () => {
			$itemName.val(localStorage.getItem(typeNametext));
			$itemDescription.val(localStorage.getItem('textarea'));
			$itemTime.val(localStorage.getItem('date'));

			$appContainer.addClass('active');
			$overlay.addClass('active');
		});

		this.rate();

		resolve();
	},

	rate() {
		const importanceValue = $('.js-item-importance').attr('data-importance');
		if (importanceValue > 0) {
			this.updateStars(importanceValue);
		}
		$(document).on('click', '.js-importance-span', (e) => {
			e.preventDefault();

			const rateValue = $(e.currentTarget).attr('data-value');
			$(e.currentTarget)
				.parent()
				.attr('data-importance', rateValue);
			this.updateStars(rateValue);
		});
	},

	updateStars(value = 0) {
		$('.js-importance-span').each(function() {
			$(this).removeClass('active');

			if ($(this).attr('data-value') <= value) {
				$(this).addClass('active');
			}
		});
	},
});
