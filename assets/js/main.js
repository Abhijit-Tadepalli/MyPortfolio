/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		settings = {

			// Parallax background effect?
				parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
				parallaxFactor: 20

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1800px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile) {

			// Turn on touch mode.
				$body.addClass('is-touch');

			// Height fix (mostly for iOS).
				window.setTimeout(function() {
					$window.scrollTop($window.scrollTop() + 1);
				}, 0);

		}

	// Footer.
		breakpoints.on('<=medium', function() {
			$footer.insertAfter($main);
		});

		breakpoints.on('>medium', function() {
			$footer.appendTo($header);
		});

	// Header.

		// Parallax background.

			// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
				if (browser.name == 'ie'
				||	browser.mobile)
					settings.parallax = false;

			if (settings.parallax) {

				breakpoints.on('<=medium', function() {

					$window.off('scroll.strata_parallax');
					$header.css('background-position', '');

				});

				breakpoints.on('>medium', function() {

					$header.css('background-position', 'left 0px');

					$window.on('scroll.strata_parallax', function() {
						$header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
					});

				});

				$window.on('load', function() {
					$window.triggerHandler('scroll');
				});

			}

	// Main Sections: Two.

		// Lightbox gallery.
			$window.on('load', function() {

				$('#two').poptrox({
					caption: function($a) { return $a.next('h3').text(); },
					overlayColor: '#2c2c2c',
					overlayOpacity: 0.85,
					popupCloserText: '',
					popupLoaderText: '',
					selector: '.work-item a.image',
					usePopupCaption: true,
					usePopupDefaultStyling: false,
					usePopupEasyClose: false,
					usePopupNav: true,
					windowMargin: (breakpoints.active('<=small') ? 0 : 50)
				});

			});

			// Real-time project count: update the Projects heading with current number of .work-item
			(function() {
				function updateProjectCount() {
					var n = $('#two .work-item').length;
					var $el = $('#project-count');
					if ($el.length) $el.text(n);
				}

				// Initial update
				updateProjectCount();

				// Watch for DOM changes under the projects row and update count live
				var row = document.querySelector('#two .row');
				if (row && window.MutationObserver) {
					var mo = new MutationObserver(function() { updateProjectCount(); });
					mo.observe(row, { childList: true, subtree: true });
				}
			})();


			// Centered project modal: open project details in a centered overlay
			(function() {
				function closeProjectModal() {
					// Pause any playing modal videos before removal
					$('#project-modal-backdrop').find('video').each(function() {
						try { this.pause(); this.currentTime = 0; } catch (e) {}
					});
					$('#project-modal-backdrop').remove();
					$(document).off('keydown.projectModal');
				}

				function openProjectModal($item) {
					if (! $item || ! $item.length) return;
					if ($('#project-modal-backdrop').length) return; // already open

					var $backdrop = $('<div id="project-modal-backdrop" />');
					var $modal = $('<div class="project-modal" role="dialog" aria-modal="true" tabindex="-1" />');

					// Clone video (if present) and enable controls
					var $video = $item.find('video').first().clone();
					if ($video && $video.length) {
						// Make modal video non-interactive: autoplay, loop, muted; remove controls
						$video.removeAttr('controls');
						$video.prop({ autoplay: true, loop: true, muted: true, playsinline: true });
						$video.attr('aria-hidden', 'true');
					}

					var $mediaWrap = $('<div class="modal-media" />').append($video);
					var $body = $('<div class="modal-body" />').append($item.find('.project-desc').clone().show());

					var $close = $('<button class="modal-close" aria-label="Close">✕</button>');
					$close.on('click', closeProjectModal);

					$modal.append($mediaWrap).append($body).append($close);
					$backdrop.append($modal);

					// clicking backdrop (outside modal) closes
					$backdrop.on('click', function(e) {
						if (e.target === this) closeProjectModal();
					});

					$('body').append($backdrop);
					// trigger entrance
					setTimeout(function() { $modal.addClass('show'); $modal.focus();
						// try to start playback (some browsers may block autoplay with sound — we've muted)
						var v = $video && $video.get(0);
						if (v && v.play) { v.play().catch(function(){}); }
					}, 20);

					// Escape closes
					$(document).on('keydown.projectModal', function(e) { if (e.key === 'Escape') closeProjectModal(); });
				}

				// Open when clicking project title link or thumbnail video
				$(document).on('click', '#two .work-item .project-link, #two .work-item .image.fit.thumb, #two .work-item video', function(e) {
					e.preventDefault();
					var $item = $(this).closest('.work-item');
					openProjectModal($item);
				});

			})();


})(jQuery);