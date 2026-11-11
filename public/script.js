// Client-side JavaScript: this runs in the browser, not on the server.
// It is loaded at the end of <body> (partials/footer.ejs), so all the HTML
// elements already exist when these querySelector calls run.

// Category filter: highlights the clicked category button.
const categoryButtons = document.querySelectorAll('.categories .buttons');

categoryButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    event.preventDefault(); // stop the href="#" from jumping back to the top of the page

    categoryButtons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
  });
});

// Login/sign-up modal. One dialog holds both forms; the tabs switch which one is shown.
// index.ejs only renders the modal for signed-out visitors, so this is skipped when
// someone is logged in and on pages without it (e.g. the article page).
const modal = document.getElementById('auth_modal');

if (modal) {
  const tabs = document.querySelectorAll('.tab');
  // Maps each tab name (the data-tab value) to the form it controls.
  const panels = {
    login: document.getElementById('login_tab'),
    signup: document.getElementById('signup_tab'),
  };

  /**
   * Shows the form for the given tab, hides the other one and marks the tab as active.
   * @param {'login' | 'signup'} name - the data-tab value of the tab to show
   */
  function showTab(name) {
    // classList.toggle(cls, force) adds the class when `force` is true and removes it when false.
    tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === name));
    Object.entries(panels).forEach(([key, panel]) => {
      panel.hidden = key !== name;
    });
  }

  /**
   * Opens the modal with the given tab selected.
   * @param {'login' | 'signup'} tabName
   */
  function openModal(tabName) {
    showTab(tabName);
    modal.hidden = false;
  }

  // Hides the modal. The form inputs keep their values until the page reloads.
  function closeModal() {
    modal.hidden = true;
  }

  // The Login and Sign Up buttons are rendered under the same condition as the modal,
  // so they always exist here.
  document.getElementById('login').addEventListener('click', (event) => {
    event.preventDefault();
    openModal('login');
  });

  document.getElementById('signup').addEventListener('click', (event) => {
    event.preventDefault();
    openModal('signup');
  });

  // Signed-out visitors are asked to sign up first; logged-in users follow the link to /publish.
  document.getElementById('get_started').addEventListener('click', (event) => {
    event.preventDefault();
    openModal('signup');
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => showTab(tab.dataset.tab));
  });

  document.getElementById('auth_close').addEventListener('click', closeModal);

  // Close when clicking the dark background outside the box
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
}
