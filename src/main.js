document.addEventListener('DOMContentLoaded', function () {
  function initPageFunctions() {
    function scalingText() {
      const testimonials = document.querySelectorAll('.review_text')

      function shrinkToFit() {
        testimonials.forEach((testimonial) => {
          if (
            testimonial.clientHeight >
            testimonial.parentElement.clientHeight * 0.55
          ) {
            let fontSize = window
              .getComputedStyle(testimonial, null)
              .getPropertyValue('font-size')
            testimonial.style.cssText += `font-size: ${parseFloat(fontSize) - 1}px;`
            shrinkToFit()
          }
        })
      }

      function growToFit() {
        testimonials.forEach((testimonial) => {
          if (
            testimonial.clientHeight <
            testimonial.parentElement.clientHeight * 0.55
          ) {
            let fontSize = window.getComputedStyle(testimonial, null).getPropertyValue('font-size')
            testimonial.style.cssText += `font-size: ${parseFloat(fontSize) + 1}px;`
            growToFit()
          }
        })
      }

      let initialSize = window.innerWidth

      function checkWindowSize() {
        let currentSize = window.innerWidth

        if (currentSize > initialSize) {
          initialSize = currentSize
          growToFit()
        }
        if (currentSize < initialSize) {
          initialSize = currentSize
          shrinkToFit()
        }
      }

      if (testimonials.length > 0) {
        setTimeout(() => {
          shrinkToFit()
          growToFit()
        }, 1000)
        window.addEventListener('resize', checkWindowSize)
      }
    }

    scalingText();


    function handleBlank() {
      const links = document.querySelectorAll("a");

      const siteUrl = window.location.hostname;

      if (links.length > 0) {
        links.forEach(link => {
          const linkUrl = new URL(link.href).hostname;
          if (linkUrl !== siteUrl) {
            link.setAttribute("target", "_blank");
          }
        });
      }
    }

    handleBlank();

    function handleScrollNav() {
      window.addEventListener('scroll', function () {
        if (window.innerWidth > 767) {
          const logo = document.querySelector('.navbar')
          if (!logo) return
          if (window.scrollY > 0) {
            logo.classList.add('navbar-scroll')
          } else {
            logo.classList.remove('navbar-scroll')
          }
        }
      })
    }

    handleScrollNav();

    function handleCategories() {
      const projectItems = document.querySelectorAll('.project-item');

      if (projectItems) {
        projectItems.forEach(item => {
          const categoryText = item.querySelectorAll('.categories-hidden'),
            projectLine = item.querySelector('.project-line');
          let arrText = [];

          categoryText.forEach(el => {
            arrText.push(el.textContent);
          });


          if (categoryText.length > 1) {
            projectLine.textContent = arrText.join(", ");
          }
        });
      }

      const filterFormRadioButtons = document.querySelectorAll('.filter-form__radio-button');

      const filterFormReset = document.querySelector('.filter-form__radio.is--reset');

      function resetHash() {
        window.location.hash = '';
      }

      if (filterFormReset) {
        filterFormReset.addEventListener('click', resetHash);
      }

      if (filterFormRadioButtons.length > 0) {
        filterFormRadioButtons.forEach((elem) => {
          elem.addEventListener('change', (e) => {
            const filterName = e.target.nextElementSibling.textContent.toLocaleLowerCase();
            window.location.hash = filterName;
          });
        });
      }

      if (window.location.hash) {
        const hash = window.location.hash;
        const filterFormRadioLabel = document.querySelectorAll(`.filter-form__radio-label`);
        filterFormRadioLabel.forEach((elem) => {
          const filterName = elem.textContent.toLocaleLowerCase();
          if (filterName === hash.slice(1)) {
            const filterFormRadio = document.querySelectorAll('.filter-form__radio');
            filterFormRadio.forEach((elem) => {
              elem.classList.remove('is-active');
            });
            elem.previousElementSibling.checked = true;
            elem.parentElement.classList.add('is-active');
          }
        });

        let match = false;
        filterFormRadioLabel.forEach((elem) => {
          const filterName = elem.textContent.toLocaleLowerCase();
          if (filterName === hash.slice(1)) {
            match = true;
          }
        });
        if (!match) {
          window.location.hash = '';
        }
      }
    }

    handleCategories();

    function handleImages() {
      const images = document.querySelectorAll('img');

      if (images.length > 0) {
        images.forEach(image => {
          image.removeAttribute('srcset');
        })
      }
    }

    handleImages();

    function brandHover() {
      const initial = {
        sx: 2,
        sy: 1.5,
        tx: 0,
        ty: 0
      };
      const ranges = [
        { sx: [0.385, 1.53], sy: [0.9, 0.9], tx: [-30.72, 26.64], ty: [-5, 0] },
        { sx: [0.67, 1.238], sy: [0.9, 0.9], tx: [-63.76, 61.68], ty: [-5, 0] },
        { sx: [0.96, 0.96], sy: [0.9, 0.9], tx: [-74.22, 74.22], ty: [-5, 0] },
        { sx: [1.238, 0.67], sy: [0.9, 0.9], tx: [-61.68, 63.76], ty: [-5, 0] },
        { sx: [1.53, 0.385], sy: [0.9, 0.9], tx: [-26.64, 30.72], ty: [-5, 0] },
      ];
      const fadeDuration = 8;
      var mPos = [0, 0];
      var h = {};
      var hovered = { el: null, id: null };

      document.addEventListener('mousemove', function (e) {
        mPos = [e.clientX || mPos[0], e.clientY || mPos[1]];

        if (!hovered.el) {
          // Hovering nothing. Set actual to default for all
          for (const m in h) {
            h[m].actual = getInitialValues();
          }
        }
        else {
          // Element is hovered
          // We need to reset actuals for hovered el only with current mouse position
          // Set actuals depending on the range

          let easing = function (pos) {
            if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 4);
            return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
          }

          let box = hovered.el.getBoundingClientRect();
          let x = easing(Math.abs((mPos[0] - box.left) / hovered.el.offsetWidth));
          let y = Math.abs((mPos[1] - box.top) / hovered.el.offsetHeight);

          // Get actual from the range and set it
          for (const m in h) {
            if (m != hovered.id) {
              h[m].actual = getInitialValues();
            }
            else {
              let mask = h[hovered.id]
              for (let i = 0; i < mask.actual.length; i++) {
                let a = mask.actual[i]; // this is object of params we need to change
                let range = ranges[i];
                a.sx = range.sx[0] + (range.sx[1] - range.sx[0]) * x;
                a.sy = range.sy[0];
                a.tx = range.tx[0] + (range.tx[1] - range.tx[0]) * x;
                a.ty = range.ty[0];
              }
            }
          }
        }
      });

      document.addEventListener('mouseover', function (e) {
        if (e.target.closest('.dots') == null) {
          hovered.el = hovered.id = null;
        }
        else {
          hovered.el = e.target.closest('.dots');
          hovered.id = hovered.el.getElementsByTagName('svg')[0].id;
        }
        document.dispatchEvent(new Event('mousemove'));
      });

      addSvg(document.getElementsByClassName('dots'));
      animate();

      function animate() {
        for (const m in h) {
          for (let i = 0; i < h[m].faded.length; i++) {
            let a = h[m].actual[i];
            let f = h[m].faded[i];

            if (Math.abs(a.sx - f.sx) < 0.001) {
              f.sx = a.sx;
            }
            else {
              f.sx += (a.sx - f.sx) / fadeDuration;
            }

            if (Math.abs(a.sy - f.sy) < 0.001) {
              f.sy = a.sy;
            }
            else {
              f.sy += (a.sy - f.sy) / fadeDuration;
            }

            if (Math.abs(a.tx - f.tx) < 0.01) {
              f.tx = a.tx;
            }
            else {
              f.tx += (a.tx - f.tx) / fadeDuration
            }

            if (Math.abs(a.ty - f.ty) < 0.01) {
              f.ty = a.ty;
            }
            else {
              f.ty += (a.ty - f.ty) / fadeDuration;
            }

            if (f.sx != a.sx || f.sy != a.sy || f.tx != a.tx || f.ty != a.ty) {
              h[m].svg.children[i + 1].style =
                `transform: translate(${f.tx}%, ${f.ty}%) scale(${f.sx}, ${f.sy})`;
            }
          }
        }
        window.requestAnimationFrame(animate);
      }

      function addSvg(arr, svg) {
        for (let i = 0; i < arr.length; i++) {
          let name = 'mask' + i;
          let svg = createSvg(name);
          arr[i].appendChild(svg);
          h[name] = {};
          h[name].container = arr[i];
          h[name].svg = svg;
          h[name].actual = getInitialValues();
          h[name].faded = getInitialValues();
        }
      }

      function getInitialValues() {
        let a = [];
        for (let i = 0; i < 5; i++) {
          a.push({
            sx: initial.sx,
            sy: initial.sy,
            tx: initial.tx,
            ty: initial.ty
          });
        }
        return a;
      }

      function createSvg(id) {
        let svg = getNode('svg', { viewBox: '0 0 100 100', preserveAspectRatio: 'none', id: id, class: 'mask' });
        svg.appendChild(getNode('rect', { width: '100%', height: '100%', fill: 'white' }));

        let e1 = getNode('ellipse', { cx: '13.75', cy: '51', rx: '12.5', ry: '50', fill: 'black' });
        let e2 = getNode('ellipse', { cx: '32', cy: '51', rx: '12.5', ry: '50', fill: 'black' });
        let e3 = getNode('ellipse', { cx: '50', cy: '51', rx: '12.5', ry: '50', fill: 'black' });
        let e4 = getNode('ellipse', { cx: '68', cy: '51', rx: '12.5', ry: '50', fill: 'black' });
        let e5 = getNode('ellipse', { cx: '86', cy: '51', rx: '12.5', ry: '50', fill: 'black' });

        e1.style = e2.style = e3.style = e4.style = e5.style =
          `transform: translate(${initial.tx}%, ${initial.ty}%) scale(${initial.sx}, ${initial.sy})`;
        svg.append(e1, e2, e3, e4, e5);

        return svg
      }

      function getNode(n, v) {
        n = document.createElementNS("http://www.w3.org/2000/svg", n);
        for (var p in v)
          n.setAttributeNS(null, p, v[p]);
        return n
      }

      function isTouchDevice() {
        return (('ontouchstart' in window) ||
          (navigator.maxTouchPoints > 0) ||
          (navigator.msMaxTouchPoints > 0));
      }
    }

    brandHover();

    function handleVideos() {

      let lazyVideos = [...document.querySelectorAll(".js-video")];


      if (lazyVideos.length === 0) return;
      const handleDisplayNone = (element) => {
        const computedStyles = window.getComputedStyle(element);

        if (computedStyles.display === 'none') {
          element.remove();
        }
      };

      lazyVideos.forEach(item => {
        let src = item.querySelector('source');
        let dataSrc = src.getAttribute('data-src');


        handleDisplayNone(item.parentElement)
        if (!dataSrc) {
          item.parentElement.remove();
        }
      });

      if ("IntersectionObserver" in window) {
        let lazyVideoObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (video) {
            if (video.isIntersecting) {
              for (let source in video.target.children) {
                let videoSource = video.target.children[source];
                if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
                  videoSource.src = videoSource.dataset.src;
                }
              }

              // video.tareget.load only if it's not loaded
              if (!video.target.classList.contains('loaded')) {
                video.target.load();
              }

              // find .project-item closest to video
              const projectItem = video.target.closest('.project-item');

              video.target.classList.add("loaded");
              video.target.classList.remove("lazy");
            } else {
              video.target.pause();
              video.target.currentTime = 0;
            }
          });
        });

        lazyVideos.forEach(function (lazyVideo) {
          lazyVideoObserver.observe(lazyVideo);
        });

        // arrays for check 
        const squareArray = [4, 9, 14, 19, 24, 29, 34, 39, 44, 49, 54, 59];
        const rectangleArray = [2, 7, 12, 17, 22, 27, 32, 37, 42, 47, 52, 57];

        window.fsAttributes = window.fsAttributes || []
        window.fsAttributes.push([
          'cmsfilter',
          (filterInstances) => {
            const [filterInstance] = filterInstances

            filterInstance.listInstance.on('renderitems', (renderedItems) => {

              if (renderedItems.length > 0) {
                renderedItems.forEach(item => {
                  item.element.classList.remove('square', 'rectangle')
                  let videos = item.element.querySelectorAll('.loaded');
                  let notLoadedVideos = item.element.querySelectorAll('.lazy');
                  if (notLoadedVideos.length > 0) {
                    // call lazyVideoObserver 
                    notLoadedVideos.forEach(video => {
                      lazyVideoObserver.observe(video);
                    });
                  }
                  if (videos.length > 0) {
                    videos.forEach(video => {
                      let source = video.querySelector('source');
                      if (source.src !== '') {
                        video.play();
                      }
                    })
                  }
                })
                const renderedItemsLength = renderedItems.length;
                squareArray.forEach(number => {
                  if (renderedItemsLength === number) {
                    renderedItems[number - 1].element.classList.add('square');
                  }
                });

                rectangleArray.forEach(number => {
                  if (renderedItemsLength === number) {
                    renderedItems[number - 2].element.classList.add('rectangle');
                    renderedItems[number - 1].element.classList.add('rectangle');
                  }
                });
              }

            })
          },
        ]);
      }
    }

    handleVideos();

    function handleFilters() {
      // Filter
      const dropdownItems = document.querySelectorAll('.filters-dropdown__list--item');
      const filterWrapper = document.querySelectorAll('.filter-collection__wrapper');
      const resetFilter = document.querySelector('.filter-form__radio-label.is--reset');
      const filters = document.querySelectorAll('.filter-form__radio');

      if (filters.length > 0) {
        filters.forEach(item => {
          item.addEventListener('click', e => {
            removeFilterActiveClass();
            addFilterActiveClass(item);
          });
        });
      };

      // handle adding active class to clicked filter
      function addFilterActiveClass(item) {
        item.classList.add('is-active');
      };

      function removeFilterActiveClass() {
        filters.forEach(item => {
          item.classList.remove('is-active');
        });
      };

      if (dropdownItems.length > 0) {
        dropdownItems.forEach((item, i) => {
          item.addEventListener('click', () => {
            handleRemoveActiveClass();
            handleFilterClick(item, filterWrapper[i]);
            resetFilter.click();
          });
        });
      }


      // handle adding active class to filter and dropdown item if clicked item has the same data-filter-name attr
      function handleFilterClick(filterDropdownItem, filterWrapper) {
        const dropdownFilterName = filterDropdownItem.getAttribute('data-filter-name');
        const filterWrapperFilterName = filterWrapper.getAttribute('data-filter-name');

        if (dropdownFilterName === filterWrapperFilterName) {
          filterDropdownItem.classList.add('is--active');
          filterWrapper.classList.add('is--active');
        } else {
          filterDropdownItem.classList.remove('is--active');
          filterWrapper.classList.remove('is--active');
        }
      };

      // handling remove all active classes from filter and dropdown items
      function handleRemoveActiveClass() {
        dropdownItems.forEach((item) => {
          item.classList.remove('is--active');
        });

        filterWrapper.forEach((item) => {
          item.classList.remove('is--active');
        });
      };
    }

    handleFilters();

    function handleReelPopup() {
      const modal = document.querySelector('.modal');
      const modalVideo = document.querySelector('.modal video');
      const body = document.body;

      const reelItem = document.querySelector('[data-name="Reel"]');

      if (reelItem) {
        reelItem.addEventListener('click', openModal);
      }

      document.addEventListener('click', function (event) {
        if (event.target.closest('#close-esc-modal')) {
          closeModal()
        }
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          closeModal()
        }
      });

      function closeModal() {
        modal.style.display = 'none';
        body.style.overflow = '';
        modalVideo.pause();
      }

      function openModal() {
        modal.style.display = 'block';
        body.style.overflow = 'hidden';
        modalVideo.play();
      }
    }

    handleReelPopup();

    function handleCreateSVG() {
      const customSvg = document.querySelector('.custom-svg')
      const paragraph = customSvg.querySelector('p')

      if (customSvg && paragraph) {
        const paragraphText = paragraph.textContent
        customSvg.innerHTML = paragraphText
      }
    }

    handleCreateSVG();

    function handleSliders() {
      const sliders = document.querySelectorAll('.swiper')

      if (sliders.length > 0) {
        sliders.forEach(slider => {
          const swiper = new Swiper(slider, {
            spaceBetween: 30,
            effect: "fade",
            autoplay: {
              delay: 5000,
            },
          });
        });
      }
    }

    handleSliders();

    function addNonScalingStrokes() {
      const svgs = document.querySelectorAll("svg");

      if (svgs.length > 0) {
        svgs.forEach((svg) => {
          addNonScalingStroke(svg);
        });
      }

      function addNonScalingStroke(svg) {
        const paths = svg.querySelectorAll("path");
        const circles = svg.querySelectorAll("circle");
        const ellipses = svg.querySelectorAll("ellipse");
        const rect = svg.querySelectorAll("rect");
        const polygons = svg.querySelectorAll("polygon");

        const allPaths = [...paths, ...circles, ...ellipses, ...rect, ...polygons];

        allPaths.forEach((path) => {
          path.setAttribute("vector-effect", "non-scaling-stroke");
        });
      }
    }

    addNonScalingStrokes();

    function handleClocks() {
      const clocks = document.querySelectorAll('.clock');

      function setUserClock() {
        const userClock = clocks[0];
        const now = new Date();

        const seconds = now.getSeconds();
        const mins = now.getMinutes();
        const hour = now.getHours();

        const minsHand = userClock.querySelector('.min-hand');
        const hourHand = userClock.querySelector('.hour-hand');

        const minsDegrees = ((mins / 60) * 360) + ((seconds / 60) * 6) + 90;
        const hourDegrees = ((hour / 12) * 360) + ((mins / 60) * 30) + 90;

        minsHand.style.transform = `rotate(${minsDegrees}deg)`;
        hourHand.style.transform = `rotate(${hourDegrees}deg)`;

        updateClockText(userClock, now);
      }

      function setDate(clock) {
        const now = new Date();

        const timezoneOffset = parseInt(clock.getAttribute('data-timezone'), 10);
        const userTimezoneOffset = now.getTimezoneOffset();
        const timezoneDifference = (userTimezoneOffset + (timezoneOffset * 60)) * 60 * 1000;
        const localTime = new Date(now.getTime() + timezoneDifference);

        const seconds = localTime.getSeconds();
        const mins = localTime.getMinutes();
        const hour = localTime.getHours();

        const secondHand = clock.querySelector('.second-hand');
        const minsHand = clock.querySelector('.min-hand');
        const hourHand = clock.querySelector('.hour-hand');

        const secondsDegrees = ((seconds / 60) * 360) + 90;
        const minsDegrees = ((mins / 60) * 360) + ((seconds / 60) * 6) + 90;
        const hourDegrees = ((hour / 12) * 360) + ((mins / 60) * 30) + 90;

        secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
        minsHand.style.transform = `rotate(${minsDegrees}deg)`;
        hourHand.style.transform = `rotate(${hourDegrees}deg)`;

        updateClockText(clock, localTime);
      }

      function dateToText(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if (minutes < 10) minutes = '0' + minutes;
        if (hours < 10) hours = '0' + hours;
        return hours + ":" + minutes;
      }

      function updateClockText(clock, localTime) {
        clock.querySelector('.clock-text').innerHTML = dateToText(localTime);
      }

      function updateClocks() {
        setDate(clocks[1]);
        setDate(clocks[2]);
        setDate(clocks[3]);
      }

      function getUserTimezone() {
        const now = new Date();
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timezoneAbbr = now.toLocaleTimeString('en', { timeZoneName: 'short' });

        return { userTimezone, timezoneAbbr };
      }

      if (clocks.length > 0) {
        const { userTimezone, timezoneAbbr } = getUserTimezone();
        console.log(`User's timezone: ${userTimezone}`);
        console.log(`Timezone abbreviation: ${timezoneAbbr}`);

        updateClocks();
        setInterval(updateClocks, 1000);

        setUserClock();
        setInterval(setUserClock, 1000);
      }
    }

    handleClocks();

    function handleFormatListItems() {
      const listItems = document.querySelectorAll('.rich-text-default-services li');

      if (listItems.length > 0) {
        listItems.forEach(item => {
          item.classList.add('paragraph-base');
        });
      }
    }

    handleFormatListItems();

    function handleSVGCreating() {
      const svgs = document.querySelectorAll('.svg-code')
      svgs.forEach(function (element, index) {
        let svgCode = element.textContent;
        let svgElement = new DOMParser().parseFromString(svgCode, 'image/svg+xml').querySelector('svg');
        element.parentNode.insertBefore(svgElement, element.nextSibling);
      });
    }

    handleSVGCreating();

    function handleVideosOG() {
      const videoSourceElement = document.querySelector('.video-cover video source');

      if (videoSourceElement && videoSourceElement.src) {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:video');
        meta.content = videoSourceElement.src;
        document.head.appendChild(meta);
      }
    }

    handleVideosOG();

    function handlePrevNext() {
      const nextElement = document.querySelector('[fs-cmsprevnext-element="next"]');

      setTimeout(function () {
        if (nextElement && nextElement.innerHTML.trim() === '') {
          nextElement.parentElement.style.display = 'none';
        }
      }, 2000);
    }

    handlePrevNext();

    function countAmout() {
      const awardElements = document.querySelectorAll('.award-cl-item');
      const awardsNumberAmount = document.querySelector('.awards-number-amount');
      const workAwardWr = document.querySelector('.work-award-wr');


      if (awardElements.length > 0) {
        const awardCounter = awardElements.length;
        awardsNumberAmount.textContent = awardCounter;
      } else {
        workAwardWr.style.display = 'none';
      }
    }

    countAmout();
  }

  initPageFunctions();

  barba.init({
    transitions: [{
      name: 'no-transition',
      beforeLeave(data) {
        gsap.set(data.current.container, { opacity: 0 });
      },
      beforeEnter(data) {
        gsap.set(data.next.container, { opacity: 1 });
      },
      afterLeave(data) {
        window.scrollTo(0, 0);
        initPageFunctions();
      }
    }]
  });
});
