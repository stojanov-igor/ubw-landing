/* Carrd Site JS | carrd.co | License: MIT */

(function() {

	// Main.
		var	on = addEventListener,
			off = removeEventListener,
			$ = function(q) { return document.querySelector(q) },
			$$ = function(q) { return document.querySelectorAll(q) },
			$body = document.body,
			$inner = $('.inner'),
			client = (function() {
		
				var o = {
						browser: 'other',
						browserVersion: 0,
						os: 'other',
						osVersion: 0,
						mobile: false,
						canUse: null,
						flags: {
							lsdUnits: false,
						},
					},
					ua = navigator.userAgent,
					a, i;
		
				// browser, browserVersion.
					a = [
						[
							'firefox',
							/Firefox\/([0-9\.]+)/
						],
						[
							'edge',
							/Edge\/([0-9\.]+)/
						],
						[
							'safari',
							/Version\/([0-9\.]+).+Safari/
						],
						[
							'chrome',
							/Chrome\/([0-9\.]+)/
						],
						[
							'chrome',
							/CriOS\/([0-9\.]+)/
						],
						[
							'ie',
							/Trident\/.+rv:([0-9]+)/
						]
					];
		
					for (i=0; i < a.length; i++) {
		
						if (ua.match(a[i][1])) {
		
							o.browser = a[i][0];
							o.browserVersion = parseFloat(RegExp.$1);
		
							break;
		
						}
		
					}
		
				// os, osVersion.
					a = [
						[
							'ios',
							/([0-9_]+) like Mac OS X/,
							function(v) { return v.replace('_', '.').replace('_', ''); }
						],
						[
							'ios',
							/CPU like Mac OS X/,
							function(v) { return 0 }
						],
						[
							'ios',
							/iPad; CPU/,
							function(v) { return 0 }
						],
						[
							'android',
							/Android ([0-9\.]+)/,
							null
						],
						[
							'mac',
							/Macintosh.+Mac OS X ([0-9_]+)/,
							function(v) { return v.replace('_', '.').replace('_', ''); }
						],
						[
							'windows',
							/Windows NT ([0-9\.]+)/,
							null
						],
						[
							'undefined',
							/Undefined/,
							null
						]
					];
		
					for (i=0; i < a.length; i++) {
		
						if (ua.match(a[i][1])) {
		
							o.os = a[i][0];
							o.osVersion = parseFloat( a[i][2] ? (a[i][2])(RegExp.$1) : RegExp.$1 );
		
							break;
		
						}
		
					}
		
					// Hack: Detect iPads running iPadOS.
						if (o.os == 'mac'
						&&	('ontouchstart' in window)
						&&	(
		
							// 12.9"
								(screen.width == 1024 && screen.height == 1366)
							// 10.2"
								||	(screen.width == 834 && screen.height == 1112)
							// 9.7"
								||	(screen.width == 810 && screen.height == 1080)
							// Legacy
								||	(screen.width == 768 && screen.height == 1024)
		
						))
							o.os = 'ios';
		
				// mobile.
					o.mobile = (o.os == 'android' || o.os == 'ios');
		
				// canUse.
					var _canUse = document.createElement('div');
		
					o.canUse = function(property, value) {
		
						var style;
		
						// Get style.
							style = _canUse.style;
		
						// Property doesn't exist? Can't use it.
							if (!(property in style))
								return false;
		
						// Value provided?
							if (typeof value !== 'undefined') {
		
								// Assign value.
									style[property] = value;
		
								// Value is empty? Can't use it.
									if (style[property] == '')
										return false;
		
							}
		
						return true;
		
					};
		
				// flags.
					o.flags.lsdUnits = o.canUse('width', '100dvw');
		
				return o;
		
			}()),
			ready = {
				list: [],
				add: function(f) {
					this.list.push(f);
				},
				run: function() {
					this.list.forEach((f) => {
						f();
					});
				},
			},
			trigger = function(t) {
				dispatchEvent(new Event(t));
			},
			cssRules = function(selectorText) {
		
				var ss = document.styleSheets,
					a = [],
					f = function(s) {
		
						var r = s.cssRules,
							i;
		
						for (i=0; i < r.length; i++) {
		
							if (r[i] instanceof CSSMediaRule && matchMedia(r[i].conditionText).matches)
								(f)(r[i]);
							else if (r[i] instanceof CSSStyleRule && r[i].selectorText == selectorText)
								a.push(r[i]);
		
						}
		
					},
					x, i;
		
				for (i=0; i < ss.length; i++)
					f(ss[i]);
		
				return a;
		
			},
			escapeHtml = function(s) {
		
				// Blank, null, or undefined? Return blank string.
					if (s === ''
					||	s === null
					||	s === undefined)
						return '';
		
				// Escape HTML characters.
					var a = {
						'&': '&amp;',
						'<': '&lt;',
						'>': '&gt;',
						'"': '&quot;',
						"'": '&#39;',
					};
		
					s = s.replace(/[&<>"']/g, function(x) {
						return a[x];
					});
		
				return s;
		
			},
			thisHash = function() {
		
				var h = location.hash ? location.hash.substring(1) : null,
					a;
		
				// Null? Bail.
					if (!h)
						return null;
		
				// Query string? Move before hash.
					if (h.match(/\?/)) {
		
						// Split from hash.
							a = h.split('?');
							h = a[0];
		
						// Update hash.
							history.replaceState(undefined, undefined, '#' + h);
		
						// Update search.
							window.location.search = a[1];
		
					}
		
				// Prefix with "x" if not a letter.
					if (h.length > 0
					&&	!h.match(/^[a-zA-Z]/))
						h = 'x' + h;
		
				// Convert to lowercase.
					if (typeof h == 'string')
						h = h.toLowerCase();
		
				return h;
		
			},
			scrollToElement = function(e, style, duration) {
		
				var y, cy, dy,
					start, easing, offset, f;
		
				// Element.
		
					// No element? Assume top of page.
						if (!e)
							y = 0;
		
					// Otherwise ...
						else {
		
							offset = (e.dataset.scrollOffset ? parseInt(e.dataset.scrollOffset) : 0) * parseFloat(getComputedStyle(document.documentElement).fontSize);
		
							switch (e.dataset.scrollBehavior ? e.dataset.scrollBehavior : 'default') {
		
								case 'default':
								default:
		
									y = e.offsetTop + offset;
		
									break;
		
								case 'center':
		
									if (e.offsetHeight < window.innerHeight)
										y = e.offsetTop - ((window.innerHeight - e.offsetHeight) / 2) + offset;
									else
										y = e.offsetTop - offset;
		
									break;
		
								case 'previous':
		
									if (e.previousElementSibling)
										y = e.previousElementSibling.offsetTop + e.previousElementSibling.offsetHeight + offset;
									else
										y = e.offsetTop + offset;
		
									break;
		
							}
		
						}
		
				// Style.
					if (!style)
						style = 'smooth';
		
				// Duration.
					if (!duration)
						duration = 750;
		
				// Instant? Just scroll.
					if (style == 'instant') {
		
						window.scrollTo(0, y);
						return;
		
					}
		
				// Get start, current Y.
					start = Date.now();
					cy = window.scrollY;
					dy = y - cy;
		
				// Set easing.
					switch (style) {
		
						case 'linear':
							easing = function (t) { return t };
							break;
		
						case 'smooth':
							easing = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 };
							break;
		
					}
		
				// Scroll.
					f = function() {
		
						var t = Date.now() - start;
		
						// Hit duration? Scroll to y and finish.
							if (t >= duration)
								window.scroll(0, y);
		
						// Otherwise ...
							else {
		
								// Scroll.
									window.scroll(0, cy + (dy * easing(t / duration)));
		
								// Repeat.
									requestAnimationFrame(f);
		
							}
		
					};
		
					f();
		
			},
			scrollToTop = function() {
		
				// Scroll to top.
					scrollToElement(null);
		
			},
			loadElements = function(parent) {
		
				var a, e, x, i;
		
				// IFRAMEs.
		
					// Get list of unloaded IFRAMEs.
						a = parent.querySelectorAll('iframe[data-src]:not([data-src=""])');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Load.
								a[i].contentWindow.location.replace(a[i].dataset.src);
		
							// Save initial src.
								a[i].dataset.initialSrc = a[i].dataset.src;
		
							// Mark as loaded.
								a[i].dataset.src = '';
		
						}
		
				// Video.
		
					// Get list of videos (autoplay).
						a = parent.querySelectorAll('video[autoplay]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Play if paused.
								if (a[i].paused)
									a[i].play();
		
						}
		
				// Autofocus.
		
					// Get first element with data-autofocus attribute.
						e = parent.querySelector('[data-autofocus="1"]');
		
					// Determine type.
						x = e ? e.tagName : null;
		
						switch (x) {
		
							case 'FORM':
		
								// Get first input.
									e = e.querySelector('.field input, .field select, .field textarea');
		
								// Found? Focus.
									if (e)
										e.focus();
		
								break;
		
							default:
								break;
		
						}
		
				// Embeds.
		
					// Get unloaded embeds.
						a = parent.querySelectorAll('unloaded-script');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Create replacement script tag.
								x = document.createElement('script');
		
							// Set "loaded" data attribute (so we can unload this element later).
								x.setAttribute('data-loaded', '');
		
							// Set "src" attribute (if present).
								if (a[i].getAttribute('src'))
									x.setAttribute('src', a[i].getAttribute('src'));
		
							// Set text content (if present).
								if (a[i].textContent)
									x.textContent = a[i].textContent;
		
							// Replace.
								a[i].replaceWith(x);
		
						}
		
				// Everything else.
		
					// Create "loadelements" event.
						x = new Event('loadelements');
		
					// Get unloaded elements.
						a = parent.querySelectorAll('[data-unloaded]');
		
					// Step through list.
						a.forEach((element) => {
		
							// Clear attribute.
								element.removeAttribute('data-unloaded');
		
							// Dispatch event.
								element.dispatchEvent(x);
		
						});
		
			},
			unloadElements = function(parent) {
		
				var a, e, x, i;
		
				// IFRAMEs.
		
					// Get list of loaded IFRAMEs.
						a = parent.querySelectorAll('iframe[data-src=""]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Don't unload? Skip.
								if (a[i].dataset.srcUnload === '0')
									continue;
		
							// Mark as unloaded.
		
								// IFRAME was previously loaded by loadElements()? Use initialSrc.
									if ('initialSrc' in a[i].dataset)
										a[i].dataset.src = a[i].dataset.initialSrc;
		
								// Otherwise, just use src.
									else
										a[i].dataset.src = a[i].src;
		
							// Unload.
								a[i].contentWindow.location.replace('about:blank');
		
						}
		
				// Video.
		
					// Get list of videos.
						a = parent.querySelectorAll('video');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Pause if playing.
								if (!a[i].paused)
									a[i].pause();
		
						}
		
				// Autofocus.
		
					// Get focused element.
						e = $(':focus');
		
					// Found? Blur.
						if (e)
							e.blur();
		
				// Embeds.
				// NOTE: Disabled for now. May want to bring this back later.
				/*
		
					// Get loaded embeds.
						a = parent.querySelectorAll('script[data-loaded]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Create replacement unloaded-script tag.
								x = document.createElement('unloaded-script');
		
							// Set "src" attribute (if present).
								if (a[i].getAttribute('src'))
									x.setAttribute('src', a[i].getAttribute('src'));
		
							// Set text content (if present).
								if (a[i].textContent)
									x.textContent = a[i].textContent;
		
							// Replace.
								a[i].replaceWith(x);
		
						}
		
				*/
		
			};
		
			// Expose scrollToElement.
				window._scrollToTop = scrollToTop;
	
	// "On Load" animation.
		// Create load handler.
			var loadHandler = function() {
				setTimeout(function() {
		
					// Unmark as loading.
						$body.classList.remove('is-loading');
		
					// Mark as playing.
						$body.classList.add('is-playing');
		
					// Wait for animation complete.
						setTimeout(function() {
		
							// Unmark as playing.
								$body.classList.remove('is-playing');
		
							// Mark as ready.
								$body.classList.add('is-ready');
		
						}, 1500);
		
				}, 100);
			};
		
		// Load event.
			on('load', loadHandler);
	
	// Sections.
		(function() {
		
			var initialSection, initialScrollPoint, initialId,
				header, footer, name, hideHeader, hideFooter, disableAutoScroll,
				h, e, ee, k,
				locked = false,
				title = document.title,
				scrollPointParent = function(target) {
		
					while (target) {
		
						if (target.parentElement
						&&	target.parentElement.tagName == 'SECTION')
							break;
		
						target = target.parentElement;
		
					}
		
					return target;
		
				},
				scrollPointSpeed = function(scrollPoint) {
		
					let x = parseInt(scrollPoint.dataset.scrollSpeed);
		
					switch (x) {
		
						case 5:
							return 250;
		
						case 4:
							return 500;
		
						case 3:
							return 750;
		
						case 2:
							return 1000;
		
						case 1:
							return 1250;
		
						default:
							break;
		
					}
		
					return 750;
		
				},
				doNextScrollPoint = function(event) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find next scroll point.
						while (e && e.nextElementSibling) {
		
							e = e.nextElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
								break;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doPreviousScrollPoint = function(e) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find previous scroll point.
						while (e && e.previousElementSibling) {
		
							e = e.previousElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
								break;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doFirstScrollPoint = function(e) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find first scroll point.
						while (e && e.previousElementSibling) {
		
							e = e.previousElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doLastScrollPoint = function(e) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find last scroll point.
						while (e && e.nextElementSibling) {
		
							e = e.nextElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doNextSection = function() {
		
					var section;
		
					section = $('#main > .inner > section.active').nextElementSibling;
		
					if (!section || section.tagName != 'SECTION')
						return;
		
					location.href = '#' + section.id.replace(/-section$/, '');
		
				},
				doPreviousSection = function() {
		
					var section;
		
					section = $('#main > .inner > section.active').previousElementSibling;
		
					if (!section || section.tagName != 'SECTION')
						return;
		
					location.href = '#' + (section.matches(':first-child') ? '' : section.id.replace(/-section$/, ''));
		
				},
				doFirstSection = function() {
		
					var section;
		
					section = $('#main > .inner > section:first-of-type');
		
					if (!section || section.tagName != 'SECTION')
						return;
		
					location.href = '#' + section.id.replace(/-section$/, '');
		
				},
				doLastSection = function() {
		
					var section;
		
					section = $('#main > .inner > section:last-of-type');
		
					if (!section || section.tagName != 'SECTION')
						return;
		
					location.href = '#' + section.id.replace(/-section$/, '');
		
				},
				resetSectionChangeElements = function(section) {
		
					var ee, e, x;
		
					// Get elements with data-reset-on-section-change attribute.
						ee = section.querySelectorAll('[data-reset-on-section-change="1"]');
		
					// Step through elements.
						for (e of ee) {
		
							// Determine type.
								x = e ? e.tagName : null;
		
								switch (x) {
		
									case 'FORM':
		
										// Reset.
											e.reset();
		
										break;
		
									default:
										break;
		
								}
		
						}
		
				},
				activateSection = function(section, scrollPoint) {
		
					var sectionHeight, currentSection, currentSectionHeight,
						name, hideHeader, hideFooter, disableAutoScroll,
						ee, k;
		
					// Section already active?
						if (!section.classList.contains('inactive')) {
		
							// Get options.
								name = (section ? section.id.replace(/-section$/, '') : null);
								disableAutoScroll = name ? ((name in sections) && ('disableAutoScroll' in sections[name]) && sections[name].disableAutoScroll) : false;
		
							// Scroll to scroll point (if applicable).
								if (scrollPoint)
									scrollToElement(scrollPoint, 'smooth', scrollPointSpeed(scrollPoint));
		
							// Otherwise, just scroll to top (if not disabled for this section).
								else if (!disableAutoScroll)
									scrollToElement(null);
		
							// Bail.
								return false;
		
						}
		
					// Otherwise, activate it.
						else {
		
							// Lock.
								locked = true;
		
							// Clear index URL hash.
								if (location.hash == '#done')
									history.replaceState(null, null, '#');
		
						// Get options.
							name = (section ? section.id.replace(/-section$/, '') : null);
							hideHeader = name ? ((name in sections) && ('hideHeader' in sections[name]) && sections[name].hideHeader) : false;
							hideFooter = name ? ((name in sections) && ('hideFooter' in sections[name]) && sections[name].hideFooter) : false;
							disableAutoScroll = name ? ((name in sections) && ('disableAutoScroll' in sections[name]) && sections[name].disableAutoScroll) : false;
		
						// Deactivate current section.
		
							// Hide header and/or footer (if necessary).
		
								// Header.
									if (header && hideHeader) {
		
										header.classList.add('hidden');
		
										setTimeout(function() {
											header.style.display = 'none';
										}, 250);
		
									}
		
								// Footer.
									if (footer && hideFooter) {
		
										footer.classList.add('hidden');
		
										setTimeout(function() {
											footer.style.display = 'none';
										}, 250);
		
									}
		
							// Deactivate.
								currentSection = $('#main > .inner > section:not(.inactive)');
		
								if (currentSection) {
		
									// Get current height.
										currentSectionHeight = currentSection.offsetHeight;
		
									// Deactivate.
										currentSection.classList.add('inactive');
		
									// Reset title.
										document.title = title;
		
									// Unload elements.
										unloadElements(currentSection);
		
									// Reset section change elements.
										resetSectionChangeElements(currentSection);
		
									// Clear timeout (if present).
										clearTimeout(window._sectionTimeoutId);
		
										// Hide.
											setTimeout(function() {
												currentSection.style.display = 'none';
												currentSection.classList.remove('active');
											}, 250);
		
									}
		
							// Update title.
								if (section.dataset.title)
									document.title = section.dataset.title + ' - ' + title;
		
							// Activate target section.
								setTimeout(function() {
		
									// Show header and/or footer (if necessary).
		
										// Header.
											if (header && !hideHeader) {
		
												header.style.display = '';
		
												setTimeout(function() {
													header.classList.remove('hidden');
												}, 0);
		
											}
		
										// Footer.
											if (footer && !hideFooter) {
		
												footer.style.display = '';
		
												setTimeout(function() {
													footer.classList.remove('hidden');
												}, 0);
		
											}
		
									// Activate.
		
										// Show.
											section.style.display = '';
		
										// Trigger 'resize' event.
											trigger('resize');
		
										// Scroll to top (if not disabled for this section).
											if (!disableAutoScroll)
												scrollToElement(null, 'instant');
		
										// Get target height.
											sectionHeight = section.offsetHeight;
		
										// Set target heights.
											if (sectionHeight > currentSectionHeight) {
		
												section.style.maxHeight = currentSectionHeight + 'px';
												section.style.minHeight = '0';
		
											}
											else {
		
												section.style.maxHeight = '';
												section.style.minHeight = currentSectionHeight + 'px';
		
											}
		
										// Delay.
											setTimeout(function() {
		
												// Activate.
													section.classList.remove('inactive');
													section.classList.add('active');
		
												// Temporarily restore target heights.
													section.style.minHeight = sectionHeight + 'px';
													section.style.maxHeight = sectionHeight + 'px';
		
												// Delay.
													setTimeout(function() {
		
														// Turn off transitions.
															section.style.transition = 'none';
		
														// Clear target heights.
															section.style.minHeight = '';
															section.style.maxHeight = '';
		
														// Load elements.
															loadElements(section);
		
													 	// Scroll to scroll point (if applicable).
													 		if (scrollPoint)
																scrollToElement(scrollPoint, 'instant');
		
														// Delay.
															setTimeout(function() {
		
																// Turn on transitions.
																	section.style.transition = '';
		
																// Unlock.
																	locked = false;
		
															}, 75);
		
													}, 500 + 250);
		
											}, 75);
		
								}, 250);
		
						}
		
				},
				sections = {};
		
			// Expose doNextScrollPoint, doPreviousScrollPoint, doFirstScrollPoint, doLastScrollPoint.
				window._nextScrollPoint = doNextScrollPoint;
				window._previousScrollPoint = doPreviousScrollPoint;
				window._firstScrollPoint = doFirstScrollPoint;
				window._lastScrollPoint = doLastScrollPoint;
		
			// Expose doNextSection, doPreviousSection, doFirstSection, doLastSection.
				window._nextSection = doNextSection;
				window._previousSection = doPreviousSection;
				window._firstSection = doFirstSection;
				window._lastSection = doLastSection;
		
			// Override exposed scrollToTop.
				window._scrollToTop = function() {
		
					var section, id;
		
					// Scroll to top.
						scrollToElement(null);
		
					// Section active?
						if (!!(section = $('section.active'))) {
		
							// Get name.
								id = section.id.replace(/-section$/, '');
		
								// Index section? Clear.
									if (id == 'done')
										id = '';
		
							// Reset hash to section name (via new state).
								history.pushState(null, null, '#' + id);
		
						}
		
				};
		
			// Initialize.
		
				// Set scroll restoration to manual.
					if ('scrollRestoration' in history)
						history.scrollRestoration = 'manual';
		
				// Header, footer.
					header = $('#header');
					footer = $('#footer');
		
				// Show initial section.
		
					// Determine target.
						h = thisHash();
		
						// Contains invalid characters? Might be a third-party hashbang, so ignore it.
							if (h
							&&	!h.match(/^[a-zA-Z0-9\-]+$/))
								h = null;
		
						// Scroll point.
							if (e = $('[data-scroll-id="' + h + '"]')) {
		
								initialScrollPoint = e;
								initialSection = initialScrollPoint.parentElement;
								initialId = initialSection.id;
		
							}
		
						// Section.
							else if (e = $('#' + (h ? h : 'done') + '-section')) {
		
								initialScrollPoint = null;
								initialSection = e;
								initialId = initialSection.id;
		
							}
		
						// Missing initial section?
							if (!initialSection) {
		
								// Default to index.
									initialScrollPoint = null;
									initialSection = $('#' + 'done' + '-section');
									initialId = initialSection.id;
		
								// Clear index URL hash.
									history.replaceState(undefined, undefined, '#');
		
							}
		
					// Get options.
						name = (h ? h : 'done');
						hideHeader = name ? ((name in sections) && ('hideHeader' in sections[name]) && sections[name].hideHeader) : false;
						hideFooter = name ? ((name in sections) && ('hideFooter' in sections[name]) && sections[name].hideFooter) : false;
						disableAutoScroll = name ? ((name in sections) && ('disableAutoScroll' in sections[name]) && sections[name].disableAutoScroll) : false;
		
					// Deactivate all sections (except initial).
		
						// Initially hide header and/or footer (if necessary).
		
							// Header.
								if (header && hideHeader) {
		
									header.classList.add('hidden');
									header.style.display = 'none';
		
								}
		
							// Footer.
								if (footer && hideFooter) {
		
									footer.classList.add('hidden');
									footer.style.display = 'none';
		
								}
		
						// Deactivate.
							ee = $$('#main > .inner > section:not([id="' + initialId + '"])');
		
							for (k = 0; k < ee.length; k++) {
		
								ee[k].className = 'inactive';
								ee[k].style.display = 'none';
		
							}
		
					// Activate initial section.
						initialSection.classList.add('active');
		
					// Add ready event.
						ready.add(() => {
		
							// Update title.
								if (initialSection.dataset.title)
									document.title = initialSection.dataset.title + ' - ' + title;
		
							// Load elements.
								loadElements(initialSection);
		
								if (header)
									loadElements(header);
		
								if (footer)
									loadElements(footer);
		
							// Scroll to top (if not disabled for this section).
								if (!disableAutoScroll)
									scrollToElement(null, 'instant');
		
						});
		
				// Load event.
					on('load', function() {
		
						// Scroll to initial scroll point (if applicable).
					 		if (initialScrollPoint)
								scrollToElement(initialScrollPoint, 'instant');
		
					});
		
			// Hashchange event.
				on('hashchange', function(event) {
		
					var section, scrollPoint,
						h, e;
		
					// Lock.
						if (locked)
							return false;
		
					// Determine target.
						h = thisHash();
		
						// Contains invalid characters? Might be a third-party hashbang, so ignore it.
							if (h
							&&	!h.match(/^[a-zA-Z0-9\-]+$/))
								return false;
		
						// Scroll point.
							if (e = $('[data-scroll-id="' + h + '"]')) {
		
								scrollPoint = e;
								section = scrollPoint.parentElement;
		
							}
		
						// Section.
							else if (e = $('#' + (h ? h : 'done') + '-section')) {
		
								scrollPoint = null;
								section = e;
		
							}
		
						// Anything else.
							else {
		
								// Default to index.
									scrollPoint = null;
									section = $('#' + 'done' + '-section');
		
								// Clear index URL hash.
									history.replaceState(undefined, undefined, '#');
		
							}
		
					// No section? Bail.
						if (!section)
							return false;
		
					// Activate section.
						activateSection(section, scrollPoint);
		
					return false;
		
				});
		
				// Hack: Allow hashchange to trigger on click even if the target's href matches the current hash.
					on('click', function(event) {
		
						var t = event.target,
							tagName = t.tagName.toUpperCase(),
							scrollPoint, section;
		
						// Find real target.
							switch (tagName) {
		
								case 'IMG':
								case 'SVG':
								case 'USE':
								case 'U':
								case 'STRONG':
								case 'EM':
								case 'CODE':
								case 'S':
								case 'MARK':
								case 'SPAN':
		
									// Find ancestor anchor tag.
										while ( !!(t = t.parentElement) )
											if (t.tagName == 'A')
												break;
		
									// Not found? Bail.
										if (!t)
											return;
		
									break;
		
								default:
									break;
		
							}
		
						// Target is an anchor *and* its href is a hash?
							if (t.tagName == 'A'
							&&	t.getAttribute('href') !== null
							&&	t.getAttribute('href').substr(0, 1) == '#') {
		
								// Hash matches an invisible scroll point?
									if (!!(scrollPoint = $('[data-scroll-id="' + t.hash.substr(1) + '"][data-scroll-invisible="1"]'))) {
		
										// Prevent default.
											event.preventDefault();
		
										// Get section.
											section = scrollPoint.parentElement;
		
										// Section is inactive?
											if (section.classList.contains('inactive')) {
		
												// Reset hash to section name (via new state).
													history.pushState(null, null, '#' + section.id.replace(/-section$/, ''));
		
												// Activate section.
													activateSection(section, scrollPoint);
		
											}
		
										// Otherwise ...
											else {
		
												// Scroll to scroll point.
													scrollToElement(scrollPoint, 'smooth', scrollPointSpeed(scrollPoint));
		
											}
		
									}
		
								// Hash matches the current hash?
									else if (t.hash == window.location.hash) {
		
										// Prevent default.
											event.preventDefault();
		
										// Replace state with '#'.
											history.replaceState(undefined, undefined, '#');
		
										// Replace location with target hash.
											location.replace(t.hash);
		
									}
		
							}
		
					});
		
		})();
	
	// Browser hacks.
		// Init.
			var style, sheet, rule;
		
			// Create <style> element.
				style = document.createElement('style');
				style.appendChild(document.createTextNode(''));
				document.head.appendChild(style);
		
			// Get sheet.
				sheet = style.sheet;
		
		// Mobile.
			if (client.mobile) {
		
				// Prevent overscrolling on Safari/other mobile browsers.
				// 'vh' units don't factor in the heights of various browser UI elements so our page ends up being
				// a lot taller than it needs to be (resulting in overscroll and issues with vertical centering).
					(function() {
		
						// Lsd units available?
							if (client.flags.lsdUnits) {
		
								document.documentElement.style.setProperty('--viewport-height', '100svh');
								document.documentElement.style.setProperty('--background-height', '100lvh');
		
							}
		
						// Otherwise, use innerHeight hack.
							else {
		
								var f = function() {
									document.documentElement.style.setProperty('--viewport-height', window.innerHeight + 'px');
									document.documentElement.style.setProperty('--background-height', (window.innerHeight + 250) + 'px');
								};
		
								on('load', f);
								on('orientationchange', function() {
		
									// Update after brief delay.
										setTimeout(function() {
											(f)();
										}, 100);
		
								});
		
							}
		
					})();
		
			}
		
		// Android.
			if (client.os == 'android') {
		
				// Prevent background "jump" when address bar shrinks.
				// Specifically, this fix forces the background pseudoelement to a fixed height based on the physical
				// screen size instead of relying on "vh" (which is subject to change when the scrollbar shrinks/grows).
					(function() {
		
						// Insert and get rule.
							sheet.insertRule('body::after { }', 0);
							rule = sheet.cssRules[0];
		
						// Event.
							var f = function() {
								rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
							};
		
							on('load', f);
							on('orientationchange', f);
							on('touchmove', f);
		
					})();
		
				// Apply "is-touch" class to body.
					$body.classList.add('is-touch');
		
			}
		
		// iOS.
			else if (client.os == 'ios') {
		
				// <=11: Prevent white bar below background when address bar shrinks.
				// For some reason, simply forcing GPU acceleration on the background pseudoelement fixes this.
					if (client.osVersion <= 11)
						(function() {
		
							// Insert and get rule.
								sheet.insertRule('body::after { }', 0);
								rule = sheet.cssRules[0];
		
							// Set rule.
								rule.style.cssText = '-webkit-transform: scale(1.0)';
		
						})();
		
				// <=11: Prevent white bar below background when form inputs are focused.
				// Fixed-position elements seem to lose their fixed-ness when this happens, which is a problem
				// because our backgrounds fall into this category.
					if (client.osVersion <= 11)
						(function() {
		
							// Insert and get rule.
								sheet.insertRule('body.ios-focus-fix::before { }', 0);
								rule = sheet.cssRules[0];
		
							// Set rule.
								rule.style.cssText = 'height: calc(100% + 60px)';
		
							// Add event listeners.
								on('focus', function(event) {
									$body.classList.add('ios-focus-fix');
								}, true);
		
								on('blur', function(event) {
									$body.classList.remove('ios-focus-fix');
								}, true);
		
						})();
		
				// Apply "is-touch" class to body.
					$body.classList.add('is-touch');
		
			}
	
	// Timer.
		/**
		* Timer.
		* @param {string} id ID.
		*/
		function timer(id, options) {
		
		var _this = this,
			f;
		
		/**
		 * ID.
		 * @var {string}
		 */
		this.id = id;
		
		/**
		 * Timestamp.
		 * @var {integer}
		 */
		this.timestamp = options.timestamp;
		
		/**
		 * Duration.
		 * @var {integer}
		 */
		this.duration = options.duration;
		
		/**
		 * Unit.
		 * @var {bool}
		 */
		this.unit = options.unit;
		
		/**
		 * Mode.
		 * @var {string}
		 */
		this.mode = options.mode;
		
		/**
		 * Length.
		 * @var {integer}
		 */
		this.length = options.length;
		
		/**
		 * Complete URL.
		 * @var {string}
		 */
		this.completeUrl = options.completeUrl;
		
		/**
		 * Completion handler.
		 * @var {function}
		 */
		this.completion = options.completion;
		
		/**
		 * Defer.
		 * @var {bool}
		 */
		this.defer = options.defer;
		
		/**
		 * Persistent.
		 * @var {bool}
		 */
		this.persistent = options.persistent;
		
		/**
		 * Label style.
		 * @var {integer}
		 */
		this.labelStyle = options.labelStyle;
		
		/**
		 * Completed.
		 * @var {bool}
		 */
		this.completed = false;
		
		/**
		 * Status.
		 * @var {string}
		 */
		this.status = null;
		
		/**
		 * Timer.
		 * @var {HTMLElement}
		 */
		this.$timer = document.getElementById(this.id);
		
		/**
		 * Parent.
		 * @var {HTMLElement}
		 */
		this.$parent = document.querySelector('#' + _this.$timer.id + ' ul');
		
		/**
		 * Weeks.
		 * @var {HTMLElement}
		 */
		this.weeks = {
			$li: null,
			$digit: null,
			$components: null
		};
		
		/**
		 * Days.
		 * @var {HTMLElement}
		 */
		this.days = {
			$li: null,
			$digit: null,
			$components: null
		};
		
		/**
		 * Hours.
		 * @var {HTMLElement}
		 */
		this.hours = {
			$li: null,
			$digit: null,
			$components: null
		};
		
		/**
		 * Minutes.
		 * @var {HTMLElement}
		 */
		this.minutes = {
			$li: null,
			$digit: null,
			$components: null
		};
		
		/**
		 * Seconds.
		 * @var {HTMLElement}
		 */
		this.seconds = {
			$li: null,
			$digit: null,
			$components: null
		};
		
		// Initialize.
		
			// Defer? Add "loadelements" event listener.
				if (this.defer)
					this.$timer.addEventListener('loadelements', () => {
						this.init();
					});
		
			// Otherwise, just initialize.
				else
					this.init();
		
		};
		
		/**
		 * Initialize.
		 */
		timer.prototype.init = function() {
		
			var _this = this,
				kt, kd;
		
			// Set keys.
				kt = this.id + '-timestamp';
				kd = this.id + '-duration';
		
			// Mode.
				switch (this.mode) {
		
					case 'duration':
		
						// Convert duration to timestamp.
							this.timestamp = parseInt(Date.now() / 1000) + this.duration;
		
						// Persistent?
							if (this.persistent) {
		
								// Duration doesn't match? Unset timestamp.
									if (registry.get(kd) != this.duration)
										registry.unset(kt);
		
								// Set duration.
									registry.set(kd, this.duration);
		
								// Timestamp exists? Use it.
									if (registry.exists(kt))
										this.timestamp = parseInt(registry.get(kt));
		
								// Otherwise, set it.
									else
										registry.set(kt, this.timestamp);
		
							}
							else {
		
								// Unset timestamp, duration.
									if (registry.exists(kt))
										registry.unset(kt);
		
									if (registry.exists(kd))
										registry.unset(kd);
		
							}
		
						break;
		
					default:
						break;
		
				}
		
			// Digits.
		
				// Interval.
					window.setInterval(function() {
		
						// Update digits.
							_this.updateDigits();
		
						// Update size.
							_this.updateSize();
		
					}, 250);
		
				// Initial call.
					this.updateDigits();
		
			// Size.
		
				// Event.
					on('resize', function() {
						_this.updateSize();
					});
		
				// Initial call.
					this.updateSize();
		
		};
		
		/**
		 * Updates size.
		 */
		timer.prototype.updateSize = function() {
		
			var $items, $item, $digit, $components, $component, $label, $sublabel, $symbols,
				w, iw, h, f, i, j, found;
		
			$items = document.querySelectorAll('#' + this.$timer.id + ' ul li .item');
			$symbols = document.querySelectorAll('#' + this.$timer.id + ' .symbol');
			$components = document.querySelectorAll('#' + this.$timer.id + ' .component');
			h = 0;
			f = 0;
		
			// Reset component heights.
				for (j = 0; j < $components.length; j++) {
		
					$components[j].style.lineHeight = '';
					$components[j].style.height = '';
		
				}
		
			// Reset symbol heights, font sizes.
				for (j = 0; j < $symbols.length; j++) {
		
					$symbols[j].style.fontSize = '';
					$symbols[j].style.lineHeight = '';
					$symbols[j].style.height = '';
		
				}
		
			// Step through items.
				for (i = 0; i < $items.length; i++) {
		
					$item = $items[i];
					$component = $item.children[0].children[0];
		
					w = $component.offsetWidth;
					iw = $item.offsetWidth;
		
					// Set digit font size.
						$digit = $item.children[0];
		
						// Reset font size.
							$digit.style.fontSize = '';
		
						// Set font size.
							$digit.style.fontSize = (w * 1.65) + 'px';
		
						// Update component height.
							h = Math.max(h, $digit.offsetHeight);
		
						// Update font size.
							f = Math.max(f, (w * 1.65));
		
					// Set label visibility (if it exists).
						if ($item.children.length > 1) {
		
							$label = $item.children[1];
							found = false;
		
							// Step through sub-labels.
								for (j = 0; j < $label.children.length; j++) {
		
									$sublabel = $label.children[j];
		
									// Reset sub-label visibility.
										$sublabel.style.display = '';
		
									// Able to fit *and* haven't found a match already? Show sub-label.
										if (!found && $sublabel.offsetWidth < iw) {
		
											found = true;
											$sublabel.style.display = '';
		
										}
		
									// Otherwise, hide it.
										else
											$sublabel.style.display = 'none';
		
								}
		
						}
		
				}
		
			// Hack: Single component *and* uses a solid/outline background? Force height to that of background to
			// ensure longer digits (>=3) render correctly.
				if ($items.length == 1) {
		
					var x = $items[0].children[0],
						xs = getComputedStyle(x),
						xsa = getComputedStyle(x, ':after');
		
					if (xsa.content != 'none')
						h = parseInt(xsa.height) - parseInt(xs.marginTop) - parseInt(xs.marginBottom) + 24;
		
				}
		
			// Set component heights.
				for (j = 0; j < $components.length; j++) {
		
					$components[j].style.lineHeight = h + 'px';
					$components[j].style.height = h + 'px';
		
				}
		
			// Set symbol heights, font sizes.
				for (j = 0; j < $symbols.length; j++) {
		
					$symbols[j].style.fontSize = (f * 0.5) + 'px';
					$symbols[j].style.lineHeight = h + 'px';
					$symbols[j].style.height = h + 'px';
		
				}
		
			// Set parent height.
				this.$parent.style.height = '';
				this.$parent.style.height = this.$parent.offsetHeight + 'px';
		
		};
		
		/**
		 * Updates digits.
		 */
		timer.prototype.updateDigits = function() {
		
			var _this = this,
				x = [
					{
						class: 'weeks',
						digit: 0,
						divisor: 604800,
						label: {
							full: 'Weeks',
							abbreviated: 'Wks',
							initialed: 'W'
						}
					},
					{
						class: 'days',
						digit: 0,
						divisor: 86400,
						label: {
							full: 'Days',
							abbreviated: 'Days',
							initialed: 'D'
						}
					},
					{
						class: 'hours',
						digit: 0,
						divisor: 3600,
						label: {
							full: 'Hours',
							abbreviated: 'Hrs',
							initialed: 'H'
						}
					},
					{
						class: 'minutes',
						digit: 0,
						divisor: 60,
						label: {
							full: 'Minutes',
							abbreviated: 'Mins',
							initialed: 'M'
						}
					},
					{
						class: 'seconds',
						digit: 0,
						divisor: 1,
						label: {
							full: 'Seconds',
							abbreviated: 'Secs',
							initialed: 'S'
						}
					},
				],
				now, diff,
				zeros, status, i, j, x, z, t, s;
		
			// Mode.
				now = parseInt(Date.now() / 1000);
		
				switch (this.mode) {
		
					case 'countdown':
					case 'duration':
		
						// Timestamp exceeds now? Set diff to difference.
							if (this.timestamp >= now)
								diff = this.timestamp - now;
		
						// Otherwise ...
							else {
		
								// Set diff to zero.
									diff = 0;
		
								// Not yet completed?
									if (!this.completed) {
		
										// Mark as completed.
											this.completed = true;
		
										// Completion handler provided? Call it.
											if (this.completion)
												(this.completion)();
		
										// Complete URL was provided? Redirect to it.
											if (this.completeUrl)
												window.setTimeout(function() {
													window.location.href = _this.completeUrl;
												}, 1000);
		
									}
		
							}
		
						break;
		
					case 'countup':
		
						// Set diff to negative difference or zero, whichever is larger.
							diff = Math.max(0, now - this.timestamp);
		
						break;
		
					default:
					case 'default':
		
						// Timestamp exceeds now? Set diff to difference.
							if (this.timestamp >= now)
								diff = this.timestamp - now;
		
						// Otherwise, set diff to (negative) difference.
							else
								diff = now - this.timestamp;
		
						break;
		
				}
		
			// Apply maximum unit.
				switch (this.unit) {
		
					case 'weeks':
						break;
		
					case 'days':
						x = x.slice(1);
						break;
		
					case 'hours':
						x = x.slice(2);
						break;
		
					default:
						break;
		
				}
		
			// Update digit values.
				for (i = 0; i < x.length; i++) {
		
					x[i].digit = Math.floor(diff / x[i].divisor);
					diff -= x[i].digit * x[i].divisor;
		
				}
		
			// Count zeros.
				zeros = 0;
		
				for (i = 0; i < x.length; i++)
					if (x[i].digit == 0)
						zeros++;
					else
						break;
		
			// Delete zeros if they exceed length.
				while (zeros > 0 && x.length > this.length) {
		
					x.shift();
					zeros--;
		
				}
		
			// Determine status.
				z = [];
		
				for (i = 0; i < x.length; i++)
					z.push(x[i].class);
		
				status = z.join('-');
		
			// Output.
		
				// Same status as before? Do a quick update.
					if (status == this.status) {
		
						var $digit, $components;
		
						for (i = 0; i < x.length; i++) {
		
							$digit = document.querySelector('#' + this.id + ' .' + x[i].class + ' .digit');
							$components = document.querySelectorAll('#' + this.id + ' .' + x[i].class + ' .digit .component');
		
							// No digit? Skip.
								if (!$digit)
									continue;
		
							// Get components.
								z = [];
								t = String(x[i].digit);
		
								if (x[i].digit < 10) {
		
									z.push('0');
									z.push(t);
		
								}
								else
									for (j = 0; j < t.length; j++)
										z.push(t.substr(j, 1));
		
							// Update count class.
								$digit.classList.remove('count1', 'count2', 'count3', 'count4', 'count5');
								$digit.classList.add('count' + z.length);
		
							// Same number of components? Just update values.
								if ($components.length == z.length) {
		
									for (j = 0; j < $components.length && j < z.length; j++)
										$components[j].innerHTML = z[j];
		
								}
		
							// Otherwise, create new components.
								else {
		
									s = '';
		
									for (j = 0; j < $components.length && j < z.length; j++)
										s += '<span class="component x' + Math.random() + '">' + z[j] + '</span>';
		
									$digit.innerHTML = s;
		
								}
		
						}
		
					}
		
				// Otherwise, do a full one.
					else {
		
						s = '';
		
						for (i = 0; i < x.length && i < this.length; i++) {
		
							// Get components.
								z = [];
								t = String(x[i].digit);
		
								if (x[i].digit < 10) {
		
									z.push('0');
									z.push(t);
		
								}
								else
									for (j = 0; j < t.length; j++)
										z.push(t.substr(j, 1));
		
							// Delimiter.
								if (i > 0)
									s +=	'<li class="delimiter">' +
												'<span class="symbol">:</span>' +
											'</li>';
		
							// Number.
								s +=		'<li class="number ' + x[i].class + '">' +
												'<div class="item">';
		
								// Digit.
									s +=			'<span class="digit count' + t.length + '">';
		
									for (j = 0; j < z.length; j++)
										s +=			'<span class="component">' + z[j] + '</span>';
		
									s +=			'</span>';
		
								// Label.
									switch (this.labelStyle) {
		
										default:
										case 'full':
											s +=					'<span class="label">' +
																		'<span class="full">' + x[i].label.full + '</span>' +
																		'<span class="abbreviated">' + x[i].label.abbreviated + '</span>' +
																		'<span class="initialed">' + x[i].label.initialed + '</span>' +
																	'</span>';
		
											break;
		
										case 'abbreviated':
											s +=					'<span class="label">' +
																		'<span class="abbreviated">' + x[i].label.abbreviated + '</span>' +
																		'<span class="initialed">' + x[i].label.initialed + '</span>' +
																	'</span>';
		
											break;
		
										case 'initialed':
											s +=					'<span class="label">' +
																		'<span class="initialed">' + x[i].label.initialed + '</span>' +
																	'</span>';
		
											break;
		
										case 'none':
											break;
		
									}
		
								s +=			'</div>' +
											'</li>';
		
						}
		
						// Replace HTML.
							_this.$parent.innerHTML = s;
		
						// Update status.
							this.status = status;
		
					}
		
		};
	
	// Timer: timer01.
		new timer(
			'timer01',
			{
				mode: 'countdown',
				length: 4,
				unit: 'days',
				completeUrl: '',
				timestamp: 1740049200,
		
				labelStyle: 'full'
			}
		);
	
	// Run ready handlers.
		ready.run();

})();