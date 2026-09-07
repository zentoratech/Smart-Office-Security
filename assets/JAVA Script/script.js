/* =========================================================
   SMART OFFICE SECURITY
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   LOGIN
========================================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value.trim();

        const remember =
            document.getElementById("remember")?.checked;


        if (!username || !password) {

            alert("Please enter username and password.");

            return;
        }


        /*
            Frontend demo authentication.

            Any non-empty username/password works.

            Real authentication should be connected
            to your backend/database later.
        */

        if (remember) {

            localStorage.setItem(
                "sos_user",
                username
            );

        } else {

            sessionStorage.setItem(
                "sos_user",
                username
            );

        }


        window.location.href = "dashboard.html";

    });

}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

function forgotPassword(event) {

    if (event) {
        event.preventDefault();
    }

    alert(
        "Password recovery is currently handled by the system administrator."
    );
}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    localStorage.removeItem("sos_user");

    sessionStorage.removeItem("sos_user");

    window.location.href = "index.html";
}


/* =========================================================
   EMPLOYEE DATABASE
========================================================= */

const defaultEmployees = [

    {
        id: 1,
        name: "Alex Morgan",
        dept: "IT Security",
        role: "Security Analyst",
        access: "Elevated"
    },

    {
        id: 2,
        name: "Sarah Khan",
        dept: "Human Resources",
        role: "HR Manager",
        access: "Standard"
    },

    {
        id: 3,
        name: "Daniel Smith",
        dept: "Operations",
        role: "Operations Lead",
        access: "Elevated"
    },

    {
        id: 4,
        name: "Emma Wilson",
        dept: "Finance",
        role: "Finance Officer",
        access: "Standard"
    },

    {
        id: 5,
        name: "Michael Lee",
        dept: "IT",
        role: "Systems Engineer",
        access: "Administrator"
    },

    {
        id: 6,
        name: "James Carter",
        dept: "Operations",
        role: "Operations Officer",
        access: "Standard"
    },

    {
        id: 7,
        name: "Olivia Brown",
        dept: "Security",
        role: "SOC Analyst",
        access: "Elevated"
    }

];


function getEmployees() {

    const stored =
        localStorage.getItem("sos_employees");

    if (stored) {

        try {

            return JSON.parse(stored);

        } catch (error) {

            return defaultEmployees;

        }

    }

    return defaultEmployees;

}


function setEmployees(employees) {

    localStorage.setItem(
        "sos_employees",
        JSON.stringify(employees)
    );

}


/* =========================================================
   EMPLOYEE TABLE
========================================================= */

const employeeTable =
    document.getElementById("employeeTable");


function getInitials(name) {

    return name
        .split(" ")
        .map(word => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();

}


function getAccessClass(access) {

    if (access === "Administrator") {

        return "access-admin";

    }

    if (access === "Elevated") {

        return "access-elevated";

    }

    return "access-standard";

}


function renderEmployees(searchTerm = "") {

    if (!employeeTable) {
        return;
    }


    const employees = getEmployees();


    const filtered = employees.filter(employee => {

        const search =
            searchTerm.toLowerCase();

        return (

            employee.name
                .toLowerCase()
                .includes(search)

            ||

            employee.dept
                .toLowerCase()
                .includes(search)

            ||

            employee.role
                .toLowerCase()
                .includes(search)

            ||

            employee.access
                .toLowerCase()
                .includes(search)

        );

    });


    employeeTable.innerHTML = "";


    if (filtered.length === 0) {

        employeeTable.innerHTML = `

            <tr>

                <td colspan="6"
                    style="
                    text-align:center;
                    padding:40px;
                    color:#60788e;
                    ">

                    No employee records found.

                </td>

            </tr>

        `;

    }


    filtered.forEach(employee => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <div class="employee-cell">

                    <div class="employee-avatar">
                        ${getInitials(employee.name)}
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(employee.name)}
                        </strong>

                        <span>
                            ID-${String(employee.id).padStart(3, "0")}
                        </span>

                    </div>

                </div>

            </td>


            <td>
                ${escapeHTML(employee.dept)}
            </td>


            <td>
                ${escapeHTML(employee.role)}
            </td>


            <td>

                <span class="access-badge ${getAccessClass(employee.access)}">

                    ${escapeHTML(employee.access)}

                </span>

            </td>


            <td>

                <span class="status-active">
                    ACTIVE
                </span>

            </td>


            <td>

                <div class="table-actions">

                    <button
                        class="table-btn"
                        onclick="editEmployee(${employee.id})">

                        Edit

                    </button>


                    <button
                        class="table-btn delete"
                        onclick="deleteEmployee(${employee.id})">

                        Delete

                    </button>

                </div>

            </td>

        `;


        employeeTable.appendChild(row);

    });


    const count =
        document.getElementById("employeeCount");

    if (count) {

        count.textContent =
            filtered.length;

    }

}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   SEARCH
========================================================= */

const employeeSearch =
    document.getElementById("employeeSearch");


if (employeeSearch) {

    employeeSearch.addEventListener(
        "input",
        function () {

            renderEmployees(
                this.value
            );

        }
    );

}


/* =========================================================
   DELETE EMPLOYEE
========================================================= */

function deleteEmployee(id) {

    const employees =
        getEmployees();


    const employee =
        employees.find(
            item => item.id === id
        );


    if (!employee) {
        return;
    }


    const confirmed =
        confirm(
            `Delete ${employee.name} from the employee directory?`
        );


    if (!confirmed) {
        return;
    }


    const updated =
        employees.filter(
            item => item.id !== id
        );


    setEmployees(updated);


    renderEmployees();

}


/* =========================================================
   EDIT EMPLOYEE
========================================================= */

function editEmployee(id) {

    window.location.href =
        `edit-employee.html?id=${id}`;

}


/* =========================================================
   SAVE EMPLOYEE
========================================================= */

const employeeForm =
    document.getElementById("employeeForm");


if (employeeForm) {

    employeeForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("empName")
                    .value
                    .trim();


            const dept =
                document
                    .getElementById("empDept")
                    .value
                    .trim();


            const role =
                document
                    .getElementById("empRole")
                    .value
                    .trim();


            const access =
                document
                    .getElementById("empAccess")
                    .value;


            const idField =
                document.getElementById("employeeId");


            const employees =
                getEmployees();


            /* EDIT */

            if (idField && idField.value) {

                const id =
                    Number(idField.value);


                const index =
                    employees.findIndex(
                        employee =>
                            employee.id === id
                    );


                if (index !== -1) {

                    employees[index] = {

                        id: id,

                        name: name,

                        dept: dept,

                        role: role,

                        access: access

                    };

                }


                setEmployees(employees);


                alert(
                    "Employee profile updated successfully."
                );


                window.location.href =
                    "employees.html";


                return;
            }


            /* ADD */

            const newId =
                employees.length
                    ? Math.max(
                        ...employees.map(
                            employee => employee.id
                        )
                    ) + 1
                    : 1;


            employees.push({

                id: newId,

                name: name,

                dept: dept,

                role: role,

                access: access

            });


            setEmployees(employees);


            alert(
                "Employee created successfully."
            );


            window.location.href =
                "employees.html";

        }
    );

}


/* =========================================================
   EDIT PAGE LOAD
========================================================= */

function loadEditEmployee() {

    const idField =
        document.getElementById("employeeId");


    if (!idField) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        Number(params.get("id"));


    if (!id) {

        window.location.href =
            "employees.html";

        return;
    }


    const employees =
        getEmployees();


    const employee =
        employees.find(
            item => item.id === id
        );


    if (!employee) {

        alert(
            "Employee record not found."
        );

        window.location.href =
            "employees.html";

        return;
    }


    idField.value =
        employee.id;


    document.getElementById("empName").value =
        employee.name;


    document.getElementById("empDept").value =
        employee.dept;


    document.getElementById("empRole").value =
        employee.role;


    document.getElementById("empAccess").value =
        employee.access;

}


loadEditEmployee();


/* =========================================================
   SETTINGS PASSWORD
========================================================= */

const passwordForm =
    document.getElementById("passwordForm");


if (passwordForm) {

    passwordForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const current =
                document.getElementById(
                    "currentPassword"
                ).value;


            const newPassword =
                document.getElementById(
                    "newPassword"
                ).value;


            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value;


            if (!current || !newPassword || !confirmPassword) {

                alert(
                    "Please complete all password fields."
                );

                return;

            }


            if (newPassword !== confirmPassword) {

                alert(
                    "New passwords do not match."
                );

                return;

            }


            if (newPassword.length < 6) {

                alert(
                    "Password must contain at least 6 characters."
                );

                return;

            }


            alert(
                "Password updated successfully."
            );


            passwordForm.reset();

        }
    );

}


/* =========================================================
   REPORT CHART
========================================================= */

const chartCanvas =
    document.getElementById("securityChart");


if (chartCanvas && typeof Chart !== "undefined") {

    new Chart(
        chartCanvas,
        {

            type: "line",

            data: {

                labels: [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun"
                ],

                datasets: [

                    {
                        label: "Threats Blocked",

                        data: [
                            16,
                            23,
                            12,
                            28,
                            19,
                            25,
                            19
                        ],

                        borderColor: "#31d7ff",

                        backgroundColor:
                            "rgba(49,215,255,.07)",

                        fill: true,

                        tension: .4,

                        borderWidth: 2,

                        pointRadius: 3,

                        pointBackgroundColor:
                            "#31d7ff"

                    }

                ]

            },

            options: {

                responsive:true,

                maintainAspectRatio:false,

                plugins: {

                    legend: {

                        display:false

                    }

                },

                scales: {

                    x: {

                        grid: {

                            color:
                                "rgba(255,255,255,.035)"

                        },

                        ticks: {

                            color:"#60788e",

                            font:{
                                size:9
                            }

                        }

                    },

                    y: {

                        beginAtZero:true,

                        grid: {

                            color:
                                "rgba(255,255,255,.035)"

                        },

                        ticks: {

                            color:"#60788e",

                            font:{
                                size:9
                            }

                        }

                    }

                }

            }

        }
    );

}


/* =========================================================
   INITIAL EMPLOYEE RENDER
========================================================= */

renderEmployees();