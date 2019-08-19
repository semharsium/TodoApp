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
	submit: '.js-submit',
	itemTime: '.js-item-time',
	time: '.js-time',
	itemName: '.js-item-name',
	itemTitle: '.js-item-title',
	itemDescription: '.js-item-description',
	description: '.js-description',
	finishedCheckbox: '.js-finished-checkbox',
	itemEdit: '.js-item-edit',
	importanceItem: '.js-item-importance',
	notesContainer: '.js-notes__container',
	todosItem: '.js-todos__item',
	updateBtn: '.js-update',
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
		const $submit = $ctx.find(selectors.submit);
		const $itemTime = $ctx.find(selectors.itemTime);
		const $updateBtn = $ctx.find(selectors.updateBtn);
		const $itemName = $ctx.find(selectors.itemName);
		const $itemDescription = $ctx.find(selectors.itemDescription);
		const $importanceItem = $ctx.find(selectors.importanceItem);
		const $importanceSpan = $ctx.find(selectors.importanceSpan);
		const $notesContainer = $ctx.find(selectors.notesContainer);
		const notes = JSON.parse(localStorage.getItem('notes') || '[]'); // notes are like the users, to get the array

		this.displayNotes(notes, $notesContainer);

		if (localStorage.getItem('idCount') === null) {
			localStorage.setItem('idCount', 1);
		}

		$createFormBtn.on('click', () => {
			$appContainer.addClass('active');
			$overlay.addClass('active');
			$submit.addClass('active');
		});

		$closeButton.on('click', () => {
			$appContainer.removeClass('active');
			$overlay.removeClass('active');
		});

		$overlay.on('click', () => {
			$appContainer.removeClass('active');
			$overlay.removeClass('active');
		});

		//const $time = $ctx.find(selectors.time);
		//const $itemTitle = $ctx.find(selectors.itemTitle);
		//const $description = $ctx.find(selectors.description);

		const $finishedCheckbox = $ctx.find(selectors.finishedCheckbox);
		$submit.on('click', (e) => {
			e.preventDefault();

			const nameValue = $itemName.val();
			const descriptionValue = $itemDescription.val();
			const importanceValue = $importanceItem.attr('data-importance');
			const timeValue = $itemTime.val();

			if (!timeValue || !nameValue || !descriptionValue) {
				// eslint-disable-next-line no-alert
				alert('Bitte alle Felder ausfüllen');
			} else {
				//notes[0].name = nameValue;
				const idCount = localStorage.getItem('idCount');
				const note = {
					id: idCount,
					date: timeValue,
					description: descriptionValue,
					name: nameValue,
					rating: importanceValue,
				};
				localStorage.setItem('idCount', Number(idCount) + 1);
				notes.push(note); //to add a user to the array
				localStorage.setItem('notes', JSON.stringify(notes)); //to store the array

				//$time.text(timeValue);
				//$itemTitle.text(nameValue);
				//$description.text(descriptionValue);

				$appContainer.removeClass('active');
				$overlay.removeClass('active');
				this.displayNotes(notes, $notesContainer);
			}
		});

		$updateBtn.on('click', (e) => {
			e.preventDefault();

			const timeValue = $itemTime.val();
			const nameValue = $itemName.val();
			const descriptionValue = $itemDescription.val();
			const importanceValue = $importanceItem.attr('data-importance');

			if (!timeValue || !nameValue || !descriptionValue) {
				// eslint-disable-next-line no-alert
				alert('Bitte alle Felder ausfüllen');
			} else {
				const id = $updateBtn.data('id');
				notes[id].name = nameValue;
				notes[id].date = timeValue;
				notes[id].description = descriptionValue;
				notes[id].rating = importanceValue;

				localStorage.setItem('notes', JSON.stringify(notes)); //to store the array

				//$time.text(timeValue);
				//$itemTitle.text(nameValue);
				//$description.text(descriptionValue);

				$appContainer.removeClass('active');
				$overlay.removeClass('active');
				this.displayNotes(notes, $notesContainer);
			}
		});

		$finishedCheckbox.on('change', function(e) {
			if ($(e.currentTarget).is(':checked')) {
				const index = Number($(this).data('id')) - 1;
				notes[index].finished = true;
				localStorage.setItem('notes', JSON.stringify(notes)); //to store the array
			} else {
				const index = Number($(this).data('id')) - 1;
				notes[index].finished = false;
				localStorage.setItem('notes', JSON.stringify(notes)); //to store the array
			}
		});

		const $itemEdit = $ctx.find(selectors.itemEdit);
		$itemEdit.on('click', function() {
			const index = Number($(this).data('id')) - 1;

			$itemName.val(notes[index].name);
			$itemDescription.val(notes[index].description);
			$itemTime.val(notes[index].date);
			$importanceItem.val(notes[index].rating);

			$appContainer.addClass('active');
			$overlay.addClass('active');
			$updateBtn.addClass('active');
			$updateBtn.attr('data-id', index);
			$updateBtn.addClass('active');
		});

		this.rate($importanceSpan);
		resolve();
	},

	rate($importanceSpan) {
		const importanceValue = $('.js-item-importance').attr('data-importance');
		if (importanceValue > 0) {
			this.updateStars(importanceValue);
		}
		$importanceSpan.on('click', (e) => {
			e.preventDefault();
			const index = Number($(this).data('id')) - 1;
			const rateValue = $(e.currentTarget).attr('data-value');
			$(e.currentTarget)
				.parent()
				.attr('data-importance', rateValue);
			this.updateStars(rateValue);
			$importanceSpan.attr('data-id', index);
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

	displayNotes(notes, $notesContainer) {
		$notesContainer.empty();
		notes.forEach((element) => {
			let checked = '';
			if (element.finished) {
				checked = 'checked';
			}

			$notesContainer.append(`
			<div class="todos__item js-todos__item">
				<div class="item">
					<div class="item item-time js-time">${element.date}</div>
					<div class="item item-finished">
						<input type="checkbox" name="finished" class="js-finished-checkbox" value="" data-id=${element.id} ${checked}>
						<label for="finished">finished</label>
					</div>
				</div>
				<div class="item">
					<div class="item item-title js-item-title">${element.name}</div>
					<div class="item item-description js-description">${element.description}</div>
				</div>
				<div class="item">
					<div class="item item-importance js-importance" data-importance="${element.rating}">
						<span class="importance-span js-importance-span" name="rating" data-value="5" data-id=${element.id}>
						</span>
						<span class="importance-span js-importance-span" name="rating" data-value="4" data-id=${element.id}>
						</span>
						<span class="importance-span js-importance-span" name="rating" data-value="3" data-id=${element.id}>
						</span>
						<span class="importance-span js-importance-span" name="rating" data-value="2" data-id=${element.id}>
						</span>
						<span class="importance-span js-importance-span" name="rating" data-value="1" data-id=${element.id}>
						</span>
					</div>
					<button class="btn item item-edit js-item-edit" data-id="${element.id}">Edit</button>
				</div>
			</div>
			`);
		});
		this.ratingStars();
	},

	ratingStars() {
		const $importanceContainers = $(selectors.importance);

		$importanceContainers.each((index, importanceContainer) => {
			$(importanceContainer)
				.children()
				.each((index2, element) => {
					const amountStar = $(importanceContainer).data('importance');
					const value = $(element).data('value');
					if (amountStar >= value) {
						$(element).addClass('active'); // element == this
					}
				});
		});
	},
});
