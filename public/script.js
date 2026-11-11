// Client-side JavaScript: this runs in the browser, not on the server.
// It is loaded at the end of <body> (partials/footer.ejs), so all the HTML
// elements already exist when these querySelector calls run.
console.log('script.js loaded')


// REVIEW: Category filter: highlights the clicked category button. 
const categoryButtons = document.querySelectorAll('.categories .buttons');
console.log('buttons found:', categoryButtons.length)

categoryButtons.forEach(button => {
    button.addEventListener('click', (event)=>{
        event.preventDefault();  // stop the href="#" from jumping back to the homepage

        categoryButtons.forEach(btn => btn.classList.remove('active')); // assigns the name of each button clicked to identify that specific button
        button.classList.add('active');
        console.log('selectedCategory:', button.textContent);
    });
});


//  Logs clicks on the header buttons (useful while debugging). The modal code down also listens to these buttons, and both listeners run.
const actionButtons = document.querySelectorAll('#login, #signup, #get_started');

actionButtons.forEach(btn =>{
    btn.addEventListener('click', (event)=>{
        event.preventDefault();
        console.log('CTA button clicked', btn.textContent.trim());
    })
})


// login and signup form validation 
// Login/sign-up modal. One dialog holds both forms; the tabs switch which one

const modal = document.getElementById('auth_modal');
const tabs = document.querySelectorAll('.tab');
// REVIEW: Maps each tab name (the data-tab value) to the form it controls.
const panels = {
  login: document.getElementById('login_tab'),
  signup: document.getElementById('signup_tab'),
};

/**
 * Shows the form for the given tab, hides the other one and marks the tab as active.
 * @param {'login' | 'signup'} name - the data-tab value of the tab to show
 */
function showTab(name) {
  // REVIEW: classList.toggle(cls, force) adds the class when `force` is true and removes it when false.
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

// Only the home page has the modal, so skip this on other pages (e.g. the article page)
if (modal) {
  // The Login and Sign Up buttons are only rendered when nobody is logged in, so ?. skips them when they are missing.
  document.getElementById('login')?.addEventListener('click', (event) => {
    event.preventDefault();
    openModal('login');
  });

  document.getElementById('signup')?.addEventListener('click', (event) => {
    event.preventDefault();
    openModal('signup');
  });

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
