import AdminSideBar from "./adminSideBar";
import { Formik, Form, Field } from "formik";
import userprof from "../../assets/icons/user.png";
import Search from "../../assets/icons/search.png";
import { useEffect, useState } from "react";
function SearchUserPage() {
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (!email.trim()) {
      setUsers([]);
      return;
    }

    const delay = setTimeout(() => {
      const token = localStorage.getItem("token");
      fetch(`http://localhost:3000/search-user?email=${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUsers(data);
        })
        .catch((err) => {
          console.log("Error fetching users:", err);
        });
    }, 300);

    return () => clearTimeout(delay);
  }, [email]);
  return (
    <section className="search-user-section">
      <AdminSideBar />

      <div className="search-user-container">
        <h1 className="inter">Buscar Usuários</h1>

        <div className="search-user-input">
          <input
            type="email"
            placeholder="Digite o email do usuário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <img src={Search} />
        </div>

        <div className="search-user-box">
          {users.map((user: any) => (
            <div key={user.id} className="user-sample-box">
              <div className="user-left">
                <div className="user-icon">
                  <img src={userprof} alt="Usuário" />
                </div>

                <div className="user-info">
                  <span className="user-email inter">{user.email}</span>
                  <span className="user-name inter">{user.name}</span>
                  <span className="user-id inter">ID: {user.id}</span>
                </div>
              </div>

              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SearchUserPage;
