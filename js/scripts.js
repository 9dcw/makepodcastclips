/*!
* Start Bootstrap - Freelancer v7.0.4 (https://startbootstrap.com/theme/freelancer)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
*/
//
// Scripts
//

function get_clip() {
  var elID = event.target.id;
  target_el = elID.replace('-button','')
  var RSS_URL = document.getElementById(target_el).value;

  console.log(RSS_URL)
  var RSS_URL2 = `https://feeds.buzzsprout.com/126848.rss`;

// for a random element
//const randomElement = array[Math.floor(Math.random() * array.length)];
// then I send that to the server!


fetch(RSS_URL2)
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    console.log(data);

    console.log(data.querySelector("channel"))
    console.log(data.querySelector("channel").querySelector("title"))
    console.log(data.querySelector("channel").querySelector("description"))
    const items = data.querySelector("channel").querySelectorAll("item");

    items.forEach(el => {
      console.log(el.querySelector("title"))
      console.log(el.querySelector("enclosure"))
      console.log(el.querySelector("enclosure").getAttribute('url'))


      //console.log(el.querySelector("podcast: transcript").url)
        }
      )
    })

    let test_mp3_url = 'https://www.buzzsprout.com/126848/9310030-joe-henrich-on-cultural-evolution.mp3'

  }


window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 50,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});
