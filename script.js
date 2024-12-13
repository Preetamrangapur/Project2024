const APIURL = "https://api.github.com/users/";
const form = document.getElementById("form");
const main = document.getElementById("main");
const search = document.getElementById("search");

const createUserCard = (user) => {
  const cardHTML = `
    <div class="card">
        <div>
          <img
            src="${user.avatar_url}"
            alt="${user.name}"
            class="avatar"
          />
        </div>
        <div class="user-info">
          <h2>${user.name}</h2>
          <p>${user.bio}</p>
          <ul>
            <li>${user.followers}<strong>Followers</strong></li>
            <li>${user.following}<strong>Following</strong></li>
            <li>${user.public_repos}<strong>Repos</strong></li>
          </ul>
          <div id="repos"></div> <!-- Section to display repos within the profile -->
        </div>
      </div>
  `;
  main.innerHTML = cardHTML;
};

const createErrorCard = (message) => {
  const cardHTML = `
    <div class="card"><h1>${message}</h1></div>
  `;
  main.innerHTML = cardHTML;
};

const addReposToCard = (repos) => {
  const reposElement = document.getElementById("repos");
  repos.slice(0, 5).forEach((repo) => {
    const repoElement = document.createElement("div");
    repoElement.classList.add("repo"); // Added class for styling
    repoElement.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || "No description provided"}</p>
      <p><strong>Language:</strong> ${repo.language || "N/A"}</p>
      <a href="${repo.html_url}" class="repo-link" target="_self">View Repository</a>
    `;
    reposElement.appendChild(repoElement);
  });
};

const getUser = async (username) => {
  try {
    const { data } = await axios(APIURL + username);
    createUserCard(data);
    getRepos(username);
  } catch (error) {
    if (error.response.status == 404)
      createErrorCard("No profile with this username");
  }
};

const getRepos = async (username) => {
  try {
    const { data } = await axios(APIURL + username + "/repos?sort=created");
    addReposToCard(data);
  } catch (error) {
    createErrorCard("Problem fetching repos");
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value;
  if (user) {
    getUser(user);
    search.value = "";
  }
});