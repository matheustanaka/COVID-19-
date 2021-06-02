const main = async () => {
  const response = await fetch(
    "https://covid19-brazil-api.now.sh/api/report/v1"
  );
  const { data } = await response.json();

  const table = document.getElementById("table");
  data.map((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" +
      item.uf +
      "</td>" +
      "<td>" +
      item.cases +
      "</td>" +
      "<td>" +
      item.deaths +
      "</td>";
    table.append(tr);
  });
};

const mainCountry = async () => {
  const response = await fetch(
    "https://covid19-brazil-api.now.sh/api/report/v1/countries"
  );
  const { data } = await response.json();

  const table = document.getElementById("table2");
  data.map((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" +
      item.country +
      "</td>" +
      "<td>" +
      item.cases +
      "</td>" +
      "<td>" +
      item.deaths +
      "</td>";
    table.append(tr);
  });
};

// Smooth Scrolling
$("#navbar a, a, .btn").on("click", function (event) {
  if (this.hash !== "") {
    event.preventDefault();

    const hash = this.hash;

    $("html, body").animate(
      {
        scrollTop: $(hash).offset().top - 100,
      },
      800
    );
  }
});

main();
mainCountry();
