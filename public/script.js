console.log('script.js loaded')


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


const actionButtons = document.querySelectorAll('#login, #signup, #get_started');

actionButtons.forEach(btn =>{
    btn.addEventListener('click', (event)=>{
        event.preventDefault();
        console.log('CTA button clicked', btn.textContent.trim());
    })
})


/* login and signup form validation */
const modal = document.getElementById('auth_modal');
const tabs = document.querySelectorAll('.tab');
const panels = {
  login: document.getElementById('login_tab'),
  signup: document.getElementById('signup_tab'),
};

function showTab(name) {
  tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === name));
  Object.entries(panels).forEach(([key, panel]) => {
    panel.hidden = key !== name;
  });
}

function openModal(tabName) {
  showTab(tabName);
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
}

// Only the home page has the modal, so skip this on other pages (e.g. the article page)
if (modal) {
  document.getElementById('login').addEventListener('click', (event) => {
    event.preventDefault();
    openModal('login');
  });

  document.getElementById('signup').addEventListener('click', (event) => {
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