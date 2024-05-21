export async function getData() {
  const userApi = `https://randomuser.me/api/?results=5&seed=s1&nat=us&inc=email&noinfo`;
  const res = await fetch(userApi);
  const data = await res.json();
  return data?.results ? data.results : [];
}

export async function handler(req, res) {
  const myUsers = await getData(req);

  const html = `
        <ul>
        ${myUsers
          .map((elem) => {
            return `<li>${elem.email}</li>`;
          })
          .join('')}
    </ul>
    `;
  return res.html(html);
}
