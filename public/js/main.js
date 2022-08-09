const socket = io.connect();
// --------------------------------------

socket.on("products", prods => {
    renderProducts({prods});
  });

function renderProducts({prods}) {
  const tBody = document.getElementById("tBody");
  
  tBody.innerHTML = ejs.render(
    `<% for(let i = 0; i < prods.length; i++) { %>
      <tr>
        <td><%= prods[i].nombre %></td>
        <td>$ <%= prods[i].precio %></td>
        <td><%= prods[i].stock %></td>
        <td><%= prods[i].codigo %></td>
        <td>
          <img src=<%= prods[i].imag %> alt=<%= prods[i].nombre %> width="100px">
        </td>
      </tr>
    <% } %>`
    , {prods}
  );
}

//-------------------------------------------------------------------------------------

socket.on("messages", data => {
    const html = data.map(element => {
      return (`
        <p>
          <strong>${element.author}</strong> <span>[${element.date}]</span> : <br/> <i>${element.text}</i>
        </p>
      `);
    }).join(" ")
    document.getElementById("chat").innerHTML = html;
  });
  
  function addMessage() {
    const today = new Date();
    const now = today.toLocaleString();
    const message = {
      author: document.getElementById("usermail").value,
      date: now,
      text: document.getElementById("text").value
    };
    socket.emit("new-message", message);
    return false;
  };