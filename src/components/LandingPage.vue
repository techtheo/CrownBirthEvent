<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const isDeepDropdownOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function handleDropdownClick(event) {
  event.preventDefault() // Prevent default link behavior
  event.stopPropagation() // Prevent event from bubbling up
  isDropdownOpen.value = !isDropdownOpen.value
}

function handleDeepDropdownClick(event) {
  event.preventDefault() // Prevent default link behavior
  event.stopPropagation() // Prevent event from bubbling up
  isDeepDropdownOpen.value = !isDeepDropdownOpen.value
}

// Optional: Close the menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event) => {
    const navMenu = document.getElementById('navmenu')
    if (navMenu && !navMenu.contains(event.target)) {
      isMenuOpen.value = false
      isDropdownOpen.value = false
      isDeepDropdownOpen.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)

  // Cleanup event listener
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<template>
  <header id="header" class="header d-flex align-items-center fixed-top">
    <div class="container-fluid container-xl position-relative d-flex align-items-center">
      <router-link to="/" class="logo d-flex align-items-center me-auto">
        <!-- <img src="../../assets/img/logo.png" alt> -->
        <h1 class="sitename">CrownBirth</h1>
      </router-link>

      <nav id="navmenu" class="navmenu">
        <!-- Mobile menu close button -->
        <div class="mobile-nav-header" v-if="isMenuOpen">
          <!-- <i class="mobile-nav-close bi bi-x" @click="toggleMenu"></i> -->
        </div>
        <ul :class="{ active: isMenuOpen }">
          <li>
            <a href="#hero" class="active">Home<br /></a>
          </li>
          <li><a href="#venue">Venue</a></li>
          <!-- <li><a href="/gallery">Gallery</a></li> -->
          <li><a href="#about">About Us</a></li>
          <li><a href="#booking">Booking</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><router-link class="cta-btn" to="/signup">Login/Register</router-link></li>
        </ul>
        <!-- <i class="mobile-nav-close bi bi-x" @click="toggleMenu"></i> -->
        <i
          :class="['mobile-nav-toggle', 'd-xl-none', isMenuOpen ? 'bi bi-list' : ' bi bi-list']"
          @click="toggleMenu"
        ></i>
      </nav>
    </div>
  </header>

  <main class="main">
    <!-- Hero Section -->
    <section id="hero" class="hero section dark-background">
      <img src="https://lh3.googleusercontent.com/p/AF1QipNcFJfazcdLPsM3Qs43caMQt3MU0xBBK07CLkcf=s1360-w1360-h1020" alt="hero" data-aos="fade-in" />

      <div class="container d-flex flex-column align-items-center text-center mt-auto">
        <h2 data-aos="fade-up" data-aos-delay="100" class="">
          CrownBIRTH<br /><span>EVENT CENTRE</span>
        </h2>
        <p data-aos="fade-up" data-aos-delay="200">IJEBU_IFE</p>
        <div data-aos="fade-up" data-aos-delay="300" class="">
          <a
            href="https://lh3.googleusercontent.com/ggs/AF1QipMzms_CJCbewDac719QTBomdJ7KkpDSMMXad1GO=m18"
            class="glightbox pulsating-play-btn mt-3" target="_blank"
          ></a>
        </div>
      </div>

      <div class="about-info mt-auto position-relative">
        <div class="container position-relative" data-aos="fade-up">
          <div class="row">
            <div class="col-lg-6">
              <h2>About Event Centre</h2>
              <p>
                Sed nam ut dolor qui repellendus iusto odit. Possimus inventore eveniet accusamus
                error amet eius aut accusantium et. Non odit consequatur repudiandae sequi ea odio
                molestiae. Enim possimus sunt inventore in est ut optio sequi unde.
              </p>
            </div>
            <div class="col-lg-3">
              <h3>Where?</h3>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
            </div>
            <div class="col-lg-3">
              <h3>When?</h3>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, architecto?</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Venue Section -->
    <section id="venue" class="venue section">
      <!-- Section Title -->
      <div class="container section-title" data-aos="fade-up">
        <h2>Event Venue<br /></h2>
        <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
      </div>
      <!-- End Section Title -->

      <div class="container-fluid" data-aos="fade-up">
        <div class="row g-0">
          <div class="col-lg-6 venue-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12097.433213460943!2d-74.0062269!3d40.7101282!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xb89d1fe6bc499443!2sDowntown+Conference+Center!5e0!3m2!1smk!2sbg!4v1539943755621"
              frameborder="0"
              style="border: 0"
              allow="fullscreen"
            ></iframe>
          </div>

          <div class="col-lg-6 venue-info">
            <div class="row justify-content-center">
              <div class="col-11 col-lg-8 position-relative">
                <h3>Ijebu_Ife</h3>
                <p>
                  Iste nobis eum sapiente sunt enim dolores labore accusantium autem. Cumque beatae
                  ipsam. Est quae sit qui voluptatem corporis velit. Qui maxime accusamus possimus.
                  Consequatur sequi et ea suscipit enim nesciunt quia velit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container-fluid venue-gallery-container" data-aos="fade-up" data-aos-delay="100">
        <div class="row g-0">
          <div class="col-lg-3 col-md-4">
            <div class="venue-gallery">
              <a
                href="../../assets/img/venue-gallery/venue-gallery-1.jpg"
                target="_blank"
                class="glightbox"
                data-gall="venue-gallery"
              >
                <img
                  src="../../assets/img/venue-gallery/venue-gallery-1.jpg"
                  alt=""
                  class="img-fluid"
                />
              </a>
            </div>
          </div>

          <div class="col-lg-3 col-md-4">
            <div class="venue-gallery">
              <a
                href="../../assets/img/venue-gallery/venue-gallery-2.jpg"
                target="_blank"
                class="glightbox"
                data-gall="venue-gallery"
              >
                <img
                  src="../../assets/img/venue-gallery/venue-gallery-2.jpg"
                  alt=""
                  class="img-fluid"
                />
              </a>
            </div>
          </div>

          <div class="col-lg-3 col-md-4">
            <div class="venue-gallery">
              <a
                href="../../assets/img/venue-gallery/venue-gallery-3.jpg"
                target="_blank"
                class="glightbox"
                data-gall="venue-gallery"
              >
                <img
                  src="../../assets/img/venue-gallery/venue-gallery-3.jpg"
                  alt=""
                  class="img-fluid"
                />
              </a>
            </div>
          </div>

          <div class="col-lg-3 col-md-4">
            <div class="venue-gallery">
              <a
                href="../../assets/img/venue-gallery/venue-gallery-4.jpg"
                target="_blank"
                class="glightbox"
                data-gall="venue-gallery"
              >
                <img
                  src="../../assets/img/venue-gallery/venue-gallery-4.jpg"
                  alt=""
                  class="img-fluid"
                />
              </a>
            </div>
          </div>

          <div class="col-lg-3 col-md-4">
            <div class="venue-gallery">
              <a
                href="../../assets/img/venue-gallery/venue-gallery-5.jpg"
                target="_blank"
                class="glightbox"
                data-gall="venue-gallery"
              >
                <img
                  src="../../assets/img/venue-gallery/venue-gallery-5.jpg"
                  alt=""
                  class="img-fluid"
                />
              </a>
            </div>
          </div>

          <div class="col-lg-3 col-md-4">
            <div class="venue-gallery">
              <a
                href="../../assets/img/venue-gallery/venue-gallery-6.jpg"
                target="_blank"
                class="glightbox"
                data-gall="venue-gallery"
              >
                <img
                  src="../../assets/img/venue-gallery/venue-gallery-6.jpg"
                  alt=""
                  class="img-fluid"
                />
              </a>
            </div>
          </div>

          <div class="col-lg-3 col-md-4">
            <div class="venue-gallery">
              <a
                href="../../assets/img/venue-gallery/venue-gallery-7.jpg"
                target="_blank"
                class="glightbox"
                data-gall="venue-gallery"
              >
                <img
                  src="../../assets/img/venue-gallery/venue-gallery-7.jpg"
                  alt=""
                  class="img-fluid"
                />
              </a>
            </div>
          </div>

          <div class="col-lg-3 col-md-4">
            <div class="venue-gallery">
              <a
                href="../../assets/img/venue-gallery/venue-gallery-8.jpg"
                target="_blank"
                class="glightbox"
                data-gall="venue-gallery"
              >
                <img
                  src="../../assets/img/venue-gallery/venue-gallery-8.jpg"
                  alt=""
                  class="img-fluid"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sponsors Section -->
    <section id="sponsors" class="sponsors section light-background">
      <!-- Section Title -->
      <div class="container section-title" data-aos="fade-up">
        <h2>Sponsors</h2>
        <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
      </div>
      <!-- End Section Title -->

      <div class="container" data-aos="fade-up" data-aos-delay="100">
        <div class="row g-0 clients-wrap">
          <div class="col-xl-3 col-md-4 client-logo">
            <img src="../../assets/img/clients/client-1.png" class="img-fluid" alt="" />
          </div>
          <!-- End Client Item -->

          <div class="col-xl-3 col-md-4 client-logo">
            <img src="../../assets/img/clients/client-2.png" class="img-fluid" alt="" />
          </div>
          <!-- End Client Item -->

          <div class="col-xl-3 col-md-4 client-logo">
            <img src="../../assets/img/clients/client-3.png" class="img-fluid" alt="" />
          </div>
          <!-- End Client Item -->

          <div class="col-xl-3 col-md-4 client-logo">
            <img src="../../assets/img/clients/client-4.png" class="img-fluid" alt="" />
          </div>
          <!-- End Client Item -->

          <div class="col-xl-3 col-md-4 client-logo">
            <img src="../../assets/img/clients/client-5.png" class="img-fluid" alt="" />
          </div>
          <!-- End Client Item -->

          <div class="col-xl-3 col-md-4 client-logo">
            <img src="../../assets/img/clients/client-6.png" class="img-fluid" alt="" />
          </div>
          <!-- End Client Item -->

          <div class="col-xl-3 col-md-4 client-logo">
            <img src="../../assets/img/clients/client-7.png" class="img-fluid" alt="" />
          </div>
          <!-- End Client Item -->

          <div class="col-xl-3 col-md-4 client-logo">
            <img src="../../assets/img/clients/client-8.png" class="img-fluid" alt="" />
          </div>
          <!-- End Client Item -->
        </div>
      </div>
    </section>
    <!-- /Sponsors Section -->

    <!-- Faq Section -->
    <section id="faq" class="faq section">
      <!-- Section Title -->
      <div class="container section-title" data-aos="fade-up">
        <h2>Frequently Asked Questions</h2>
        <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
      </div>
      <!-- End Section Title -->

      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-10" data-aos="fade-up" data-aos-delay="100">
            <div class="faq-container">
              <div class="faq-item faq-active">
                <h3>Non consectetur a erat nam at lectus urna duis?</h3>
                <div class="faq-content">
                  <p>
                    Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat lacus
                    laoreet non curabitur gravida. Venenatis lectus magna fringilla urna porttitor
                    rhoncus dolor purus non.
                  </p>
                </div>
                <i class="faq-toggle bi bi-chevron-right"></i>
              </div>
              <!-- End Faq item-->

              <div class="faq-item">
                <h3>Feugiat scelerisque varius morbi enim nunc faucibus?</h3>
                <div class="faq-content">
                  <p>
                    Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id
                    interdum velit laoreet id donec ultrices. Fringilla phasellus faucibus
                    scelerisque eleifend donec pretium. Est pellentesque elit ullamcorper dignissim.
                    Mauris ultrices eros in cursus turpis massa tincidunt dui.
                  </p>
                </div>
                <i class="faq-toggle bi bi-chevron-right"></i>
              </div>
              <!-- End Faq item-->

              <div class="faq-item">
                <h3>Dolor sit amet consectetur adipiscing elit pellentesque?</h3>
                <div class="faq-content">
                  <p>
                    Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci.
                    Faucibus pulvinar elementum integer enim. Sem nulla pharetra diam sit amet nisl
                    suscipit. Rutrum tellus pellentesque eu tincidunt. Lectus urna duis convallis
                    convallis tellus. Urna molestie at elementum eu facilisis sed odio morbi quis
                  </p>
                </div>
                <i class="faq-toggle bi bi-chevron-right"></i>
              </div>
              <!-- End Faq item-->

              <div class="faq-item">
                <h3>Ac odio tempor orci dapibus. Aliquam eleifend mi in nulla?</h3>
                <div class="faq-content">
                  <p>
                    Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id
                    interdum velit laoreet id donec ultrices. Fringilla phasellus faucibus
                    scelerisque eleifend donec pretium. Est pellentesque elit ullamcorper dignissim.
                    Mauris ultrices eros in cursus turpis massa tincidunt dui.
                  </p>
                </div>
                <i class="faq-toggle bi bi-chevron-right"></i>
              </div>
              <!-- End Faq item-->

              <div class="faq-item">
                <h3>Tempus quam pellentesque nec nam aliquam sem et tortor?</h3>
                <div class="faq-content">
                  <p>
                    Molestie a iaculis at erat pellentesque adipiscing commodo. Dignissim
                    suspendisse in est ante in. Nunc vel risus commodo viverra maecenas accumsan.
                    Sit amet nisl suscipit adipiscing bibendum est. Purus gravida quis blandit
                    turpis cursus in
                  </p>
                </div>
                <i class="faq-toggle bi bi-chevron-right"></i>
              </div>
              <!-- End Faq item-->

              <div class="faq-item">
                <h3>Perspiciatis quod quo quos nulla quo illum ullam?</h3>
                <div class="faq-content">
                  <p>
                    Enim ea facilis quaerat voluptas quidem et dolorem. Quis et consequatur non sed
                    in suscipit sequi. Distinctio ipsam dolore et.
                  </p>
                </div>
                <i class="faq-toggle bi bi-chevron-right"></i>
              </div>
              <!-- End Faq item-->
            </div>
          </div>
          <!-- End Faq Column-->
        </div>
      </div>
    </section>
    <!-- /Faq Section -->

    <!-- Buy Tickets Section -->
    <section id="buy-tickets" class="buy-tickets section light-background">
      <!-- Section Title -->
      <div class="container section-title" data-aos="fade-up">
        <h2>Book Your Events<br /></h2>
        <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
      </div>
      <!-- End Section Title -->

      <div class="container">
        <div class="row gy-5 pricing-item" data-aos="fade-up" data-aos-delay="100">
          <div class="col-lg-3 d-flex align-items-center justify-content-center">
            <div class="d-flex">
              <!-- <img src="../../assets/img/event-gallery/event-gallery-2.jpg" style="border-radius: 10px;" width="50" alt=""> -->
              <h3>Main Hall</h3>
            </div>
          </div>
          <div class="col-lg-3 d-flex align-items-center justify-content-center">
            <h4><sup>$</sup>150<span></span></h4>
          </div>
          <div class="col-lg-3 d-flex align-items-center justify-content-center">
            <ul>
              <li><i class="bi bi-check"></i> <span>Quam adipiscing vitae proin</span></li>
              <li><i class="bi bi-check"></i> <span>Nulla at volutpat diam uteera</span></li>
              <li class="na">
                <i class="bi bi-x"></i> <span>Pharetra massa massa ultricies</span>
              </li>
            </ul>
          </div>
          <div class="col-lg-3 d-flex align-items-center justify-content-center">
            <div class="text-center"><a href="#" class="buy-btn">Book Now</a></div>
          </div>
        </div>
      </div>
    </section>
    <!-- /Buy Tickets Section -->

    <!-- Contact Section -->
    <section id="contact" class="contact section">
      <!-- Section Title -->
      <div class="container section-title" data-aos="fade-up">
        <h2>Contact</h2>
        <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
      </div>
      <!-- End Section Title -->

      <div class="container" data-aos="fade-up" data-aos-delay="100">
        <div class="row gy-4">
          <div class="col-lg-6">
            <div
              class="info-item d-flex flex-column justify-content-center align-items-center"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <i class="bi bi-geo-alt"></i>
              <h3>Address</h3>
              <p>Ijebu_Ode, NY 535022</p>
            </div>
          </div>
          <!-- End Info Item -->

          <div class="col-lg-3 col-md-6">
            <div
              class="info-item d-flex flex-column justify-content-center align-items-center"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <i class="bi bi-telephone"></i>
              <h3>Call Us</h3>
              <p>+234 9021 45 6689</p>
            </div>
          </div>
          <!-- End Info Item -->

          <div class="col-lg-3 col-md-6">
            <div
              class="info-item d-flex flex-column justify-content-center align-items-center"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <i class="bi bi-envelope"></i>
              <h3>Email Us</h3>
              <p>EduTAMS_AMBASSADOR@gmail.com</p>
            </div>
          </div>
          <!-- End Info Item -->
        </div>

        <div class="row gy-4 mt-1">
          <div class="col-lg-6" data-aos="fade-up" data-aos-delay="300">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d48389.78314118045!2d-74.006138!3d40.710059!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sDowntown%20Conference%20Center!5e0!3m2!1sen!2sus!4v1676961268712!5m2!1sen!2sus"
              frameborder="0"
              style="border: 0; width: 100%; height: 400px"
              allow="fullscreen"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <!-- End Google Maps -->

          <div class="col-lg-6">
            <form
              action="forms/contact.php"
              method="post"
              class="php-email-form"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div class="row gy-4">
                <div class="col-md-6">
                  <input
                    type="text"
                    name="name"
                    class="form-control"
                    placeholder="Your Name"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <input
                    type="email"
                    class="form-control"
                    name="email"
                    placeholder="Your Email"
                    required
                  />
                </div>

                <div class="col-md-12">
                  <input
                    type="text"
                    class="form-control"
                    name="subject"
                    placeholder="Subject"
                    required
                  />
                </div>

                <div class="col-md-12">
                  <textarea
                    class="form-control"
                    name="message"
                    rows="6"
                    placeholder="Message"
                    required
                  ></textarea>
                </div>

                <div class="col-md-12 text-center">
                  <div class="loading">Loading</div>
                  <div class="error-message"></div>
                  <div class="sent-message">Your message has been sent. Thank you!</div>

                  <button style="border-radius: 0" type="submit">Send Message</button>
                </div>
              </div>
            </form>
          </div>
          <!-- End Contact Form -->
        </div>
      </div>
    </section>
    <!-- /Contact Section -->
  </main>

  <footer id="footer" class="footer dark-background">
    <div class="footer-top">
      <div class="container">
        <div class="row gy-4">
          <div class="col-lg-4 col-md-6 footer-about">
            <a href="index.html" class="logo d-flex align-items-center">
              <span class="sitename">CrownBirth</span>
            </a>
            <div class="footer-contact pt-3">
              <p>Ijebu_Ode</p>
              <p>Nigeria, NY 535022</p>
              <p class="mt-3"><strong>Phone:</strong> <span>+234 0000000000</span></p>
              <p><strong>Email:</strong> <span>info@example.com</span></p>
            </div>
          </div>

          <div class="col-lg-2 col-md-3 footer-links">
            <h4>Useful Links</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#about">About us</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Terms of service</a></li>
              <li><a href="#">Privacy policy</a></li>
            </ul>
          </div>

          <div class="col-lg-2 col-md-3 footer-links">
            <h4>Our Services</h4>
            <ul>
              <li><a href="#">Web Design</a></li>
              <li><a href="#">Web Development</a></li>
              <li><a href="#">Product Management</a></li>
              <li><a href="#">Marketing</a></li>
              <li><a href="#">Graphic Design</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="copyright text-center">
      <div
        class="container d-flex flex-column flex-lg-row justify-content-center justify-content-lg-between align-items-center"
      >
        <div class="d-flex flex-column align-items-center align-items-lg-start">
          <div>
            © Copyright <strong><span>EduTAMS</span></strong
            >. All Rights Reserved
          </div>
          <div class="credits">
            <span
              >Designed by
              <a target="_blank" href="https://portfolio-davids-projects-af584ffd.vercel.app/"
                >EduTAMS_AMBASSADOR</a
              ></span
            >
          </div>
        </div>
      </div>

      <div class="social-links order-first order-lg-last mb-3 mb-lg-0">
        <a href="#"><i class="bi bi-twitter-x"></i></a>
        <a href="#"><i class="bi bi-facebook"></i></a>
        <a href="#"><i class="bi bi-instagram"></i></a>
        <a href="#"><i class="bi bi-linkedin"></i></a>
      </div>
    </div>
  </footer>
  <div>
    <a href="#" id="scroll-top" class="scroll-top d-flex align-items-center justify-content-center"
      ><i class="bi bi-arrow-up-short"></i
    ></a>
  </div>

  <!-- Preloader -->
  <!-- <div id="preloader"></div> -->
</template>
<style scoped>
/* Base styles for the navigation menu */
.navmenu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

/* Styles for the menu list */
.navmenu ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Menu item styling */
.navmenu li {
  position: relative;
}

.logo {
  max-height: 50px;
}

.mobile-nav-close {
  font-size: 1.5rem;
  cursor: pointer;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Dropdown menu styling */
.navmenu ul ul {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Show dropdown when active */
.navmenu ul li:hover > ul,
.navmenu ul.active {
  display: flex;
  flex-direction: column;
  width: 100%;
}
@media (max-width: 1024px) {
  .bi-list {
    display: none;
  }
}
/* Full-screen menu for mobile view */
@media (max-width: 768px) {
  .navmenu ul {
    display: none;
    position: fixed;
    top: 10px;
    padding-top: 40px;
    left: 0;
    width: 100%;
    height: 80%;
    z-index: 1000;
    overflow-y: auto;
  }

  .navmenu ul.active {
    display: flex;
  }

  .navmenu ul ul {
    position: static;
    background: none;
    border-radius: 0;
  }
}

.bi-list {
  z-index: 1000;
  font-size: 90px;
  color: #f82249;
}
.mobile-nav-toggle {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 27px;
  cursor: pointer;
}
</style>
