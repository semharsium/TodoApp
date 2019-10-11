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
	createFormBtn: '.js-m-todo-app__button-show-create-form',
	appContainer: '.js-m-todo-app__content',
	overlay: '.js-m-todo-app__overlay',
	closeButton: '.js-m-todo-app__button-close',
	submit: '.js-m-todo-app__button-submit',
	itemTime: '.js-m-todo-app__time',
	time: '.js-m-todo-app__note-time',
	itemName: '.js-m-todo-app__item-name',
	itemTitle: '.m-todo-app__note-name',
	itemDescription: '.js-m-todo-app__item-description',
	description: '.js-m-todo-app__note-description',
	finishedCheckbox: '.js-m-todo-app__note-finished-checkbox',
	itemEdit: '.js-m-todo-app__button-edit',
	importanceItem: '.js-m-todo-app__importance-container',
	notesContainer: '.js-m-todo-app__notes-container',
	notesItem: '.js-m-todo-app__notes',
	updateBtn: '.js-m-todo-app__button-update',
	importanceSpan: '.js-m-todo-app__importance-rating',
	importance: '.js-m-todo-app__note-importance-container',
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
			this.openNotebutton($appContainer, $overlay, $('.js-m-todo-app'));
			this.clearValues($itemTime, $itemName, $itemDescription, $importanceSpan);
			$submit.addClass('active');
			$updateBtn.removeClass('active');
		});

		$closeButton.on('click', () => {
			this.displayContents($appContainer, $overlay);
		});

		$overlay.on('click', () => {
			this.displayContents($appContainer, $overlay);
		});

		const $finishedCheckbox = $ctx.find(selectors.finishedCheckbox);
		$submit.on('click', () => {
			this.gettingValues($itemTime, $itemName, $itemDescription, $importanceItem);

			if (!this.timeValue || !this.nameValue || !this.descriptionValue) {
				// eslint-disable-next-line no-alert
				alert('Bitte alle Felder ausfüllen');
			} else {
				const idCount = localStorage.getItem('idCount');
				const note = {
					id: idCount,
					date: this.timeValue,
					description: this.descriptionValue,
					name: this.nameValue,
					rating: this.importanceValue,
				};
				localStorage.setItem('idCount', Number(idCount) + 1);
				notes.push(note); //to add a user to the array
				localStorage.setItem('notes', JSON.stringify(notes)); //to store the array

				this.displayContents($appContainer, $overlay);
				this.displayNotes(notes, $notesContainer);
			}
		});

		$updateBtn.on('click', () => {
			this.gettingValues($itemTime, $itemName, $itemDescription, $importanceItem);

			if (!this.timeValue || !this.nameValue || !this.descriptionValue) {
				// eslint-disable-next-line no-alert
				alert('Bitte alle Felder ausfüllen');
			} else {
				const id = $updateBtn.data('id');
				notes[id].name = this.nameValue;
				notes[id].date = this.timeValue;
				notes[id].description = this.descriptionValue;
				notes[id].rating = this.importanceValue;

				localStorage.setItem('notes', JSON.stringify(notes)); //to store the array
				this.displayContents($appContainer, $overlay);
				this.displayNotes(notes, $notesContainer);
			}
		});

		$finishedCheckbox.on('change', function(e) {
			if ($(e.currentTarget).is(':checked')) {
				const id = $(this).data('id');
				const index = Number(id) - 1;
				notes[index].finished = true;
				localStorage.setItem('notes', JSON.stringify(notes)); //to store the array
			} else {
				const index = Number($(this).data('id')) - 1;
				notes[index].finished = false;
				localStorage.setItem('notes', JSON.stringify(notes)); //to store the array
			}
		});

		const $itemEdit = $ctx.find(selectors.itemEdit);
		$itemEdit.on('click', (e) => {
			const itemIndex = Number($(e.currentTarget).data('id')) - 1;

			$itemName.val(notes[itemIndex].name);
			$itemDescription.val(notes[itemIndex].description);
			$itemTime.val(notes[itemIndex].date);
			$importanceItem.attr('data-importance', notes[itemIndex].rating);
			const amountStar = $importanceItem.attr('data-importance');

			this.displayStars($importanceItem, amountStar);
			this.openNotebutton($appContainer, $overlay, $('.js-m-todo-app'));
			$updateBtn.addClass('active');
			$submit.removeClass('active');
			$updateBtn.attr('data-id', itemIndex);
		});

		this.rate($importanceSpan);
		resolve();
	},

	rate($importanceSpan) {
		const importanceValue = $('.m-todo-app__importance-container').attr('data-importance');
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
		$('.js-m-todo-app__importance-rating').each(function() {
			$(this).removeClass('active');

			if ($(this).attr('data-value') <= value) {
				$(this).addClass('active');
			}
		});
	},

	gettingValues($gettimevalue, $getnamevalue, $getdescriptionvalue, $getratingvalue) {
		this.timeValue = $gettimevalue.val();
		this.nameValue = $getnamevalue.val();
		this.descriptionValue = $getdescriptionvalue.val();
		this.importanceValue = $getratingvalue.attr('data-importance');
	},

	clearValues($time, $name, $description, $rating) {
		$name.val('');
		$description.val('');
		$rating.removeClass('active');
		$time.val('');
	},

	displayStars($importanceItem, amountStar) {
		$importanceItem.children().each((index, element) => {
			const value = $(element).data('value');
			if (amountStar >= value) {
				$(element).addClass('active'); // element == this
			} else {
				$(element).removeClass('active');
			}
		});
	},

	openNotebutton($notescontainer, $hidecontent, $wholeapp) {
		$notescontainer.addClass('active');
		$hidecontent.addClass('active');
		$wholeapp.addClass('m-todo-app-noscroll');
	},

	displayContents($notescontainer, $hidecontent) {
		$notescontainer.removeClass('active');
		$hidecontent.removeClass('active');
	},

	displayNotes(notes, $notesContainer) {
		$notesContainer.empty();
		notes.forEach((element) => {
			let checked = '';
			let finish = '';
			if (element.finished) {
				checked = 'checked';
				finish = 'm-todo-app__notes-finish';
			}

			$notesContainer.append(`
			<div class="m-todo-app__notes ${finish} js-m-todo-app__notes" id="demo-${element.id} ">
				<div class="m-todo-app__note">
					<div class="m-todo-app__note m-todo-app__note-time js-m-todo-app__note-time">${element.date}</div>
					<div class="m-todo-app__note m-todo-app__note-finished">
						<input type="checkbox" name="finished" class="m-todo-app__note-finished-checkbox js-m-todo-app__note-finished-checkbox" value="" data-id=${
							element.id
						} ${checked}>
						<label for="finished">finished</label>
					</div>
				</div>
				<div class="m-todo-app__note">
					<div class="m-todo-app__note m-todo-app__note-name js-m-todo-app__note-name">${element.name}</div>
					<div class="m-todo-app__note m-todo-app__note-description js-m-todo-app__note-description">${element.description}</div>
				</div>
				<div class="m-todo-app__note">
					<div class="m-todo-app__note m-todo-app__note-importance-container  js-m-todo-app__note-importance-container" data-importance="${
						element.rating
					}">
						<span class="m-todo-app__importance-rating m-todo-app__importance-rating-stars" name="rating" data-value="5" data-id=${
							element.id
						}>
						</span>
						<span class="m-todo-app__importance-rating m-todo-app__importance-rating-stars" name="rating" data-value="4" data-id=${
							element.id
						}>
						</span>
						<span class="m-todo-app__importance-rating m-todo-app__importance-rating-stars" name="rating" data-value="3" data-id=${
							element.id
						}>
						</span>
						<span class="m-todo-app__importance-rating m-todo-app__importance-rating-stars" name="rating" data-value="2" data-id=${
							element.id
						}>
						</span>
						<span class="m-todo-app__importance-rating m-todo-app__importance-rating-stars" name="rating" data-value="1" data-id=${
							element.id
						}>
						</span>
					</div>
					<button class="m-todo-app__button m-todo-app__button-edit js-m-todo-app__button-edit" data-id="${
						element.id
					}">Edit</button>
				</div>
			</div>
			`);
		});
		$('.m-todo-app__notes-finish').appendTo($notesContainer);
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
