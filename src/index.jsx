import { render } from "preact";
import { useState } from "preact/hooks";
import "./style.css";

function App() {
  const [originalAmount, setOriginalAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [shippingFee, setShippingFee] = useState("");
  const [people, setPeople] = useState([{ id: 1, name: "Người 1", amount: 0 }]);
  const [results, setResults] = useState(null);

  const addPerson = () => {
    const newId = people.length + 1;
    setPeople([...people, { id: newId, name: `Người ${newId}`, amount: 0 }]);
  };

  const removePerson = (id) => {
    if (people.length > 1) {
      setPeople(people.filter((person) => person.id !== id));
    }
  };

  const updatePerson = (id, field, value) => {
    setPeople(
      people.map((person) =>
        person.id === id ? { ...person, [field]: value } : person
      )
    );
  };

  const calculateSplit = () => {
    const original = parseFloat(originalAmount) || 0;
    const final = parseFloat(finalAmount) || 0;
    const shipping = parseFloat(shippingFee) || 0;

    // Tính toán: Phí ship được tính vào số tiền gốc
    const originalWithShipping = original + shipping;
    const discountAmount = originalWithShipping - final;

    const totalPersonAmount = people.reduce(
      (sum, person) => sum + (parseFloat(person.amount) || 0),
      0
    );

    if (totalPersonAmount === 0) {
      // Chia đều
      const perPerson = final / people.length;
      const newPeople = people.map((person) => ({
        ...person,
        payAmount: perPerson,
      }));
      setResults({
        originalTotal: original,
        shippingFee: shipping,
        originalWithShipping,
        discountAmount,
        finalTotal: final,
        people: newPeople,
        splitType: "equal",
      });
    } else {
      // Chia theo tỷ lệ
      const newPeople = people.map((person) => {
        const personAmount = parseFloat(person.amount) || 0;
        const ratio = personAmount / totalPersonAmount;
        const payAmount = final * ratio;
        return {
          ...person,
          payAmount,
        };
      });
      setResults({
        originalTotal: original,
        shippingFee: shipping,
        originalWithShipping,
        discountAmount,
        finalTotal: final,
        people: newPeople,
        splitType: "proportional",
      });
    }
  };

  const resetForm = () => {
    setOriginalAmount("");
    setFinalAmount("");
    setShippingFee("");
    setPeople([{ id: 1, name: "Người 1", amount: 0 }]);
    setResults(null);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>💰 Chia Tiền</h1>
        <p>Chia sẻ hóa đơn một cách công bằng</p>
      </header>

      <main className="main">
        {!results ? (
          <div className="form-container">
            <div className="form-section">
              <h2>📋 Thông tin đơn hàng</h2>
              <div className="input-group">
                <label htmlFor="originalAmount">Số tiền hàng (VNĐ):</label>
                <input
                  type="number"
                  id="originalAmount"
                  value={originalAmount}
                  onChange={(e) => setOriginalAmount(e.target.value)}
                  placeholder="Nhập số tiền hàng..."
                  min="0"
                />
              </div>

              <div className="input-group">
                <label htmlFor="shippingFee">Phí ship (VNĐ):</label>
                <input
                  type="number"
                  id="shippingFee"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                  placeholder="Nhập phí ship..."
                  min="0"
                />
              </div>

              <div className="input-group">
                <label htmlFor="finalAmount">Số tiền cuối cùng (VNĐ):</label>
                <input
                  type="number"
                  id="finalAmount"
                  value={finalAmount}
                  onChange={(e) => setFinalAmount(e.target.value)}
                  placeholder="Nhập số tiền cuối cùng..."
                  min="0"
                />
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <h2>👥 Danh sách người tham gia</h2>
              </div>

              <div className="people-table-container">
                <table className="people-table">
                  <thead>
                    <tr>
                      <th className="col-name">Tên người</th>
                      <th className="col-amount">Số tiền đặt (VNĐ)</th>
                      <th className="col-actions">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {people.map((person) => (
                      <tr key={person.id} className="person-row">
                        <td>
                          <input
                            type="text"
                            value={person.name}
                            onChange={(e) =>
                              updatePerson(person.id, "name", e.target.value)
                            }
                            placeholder="Nhập tên..."
                            className="table-input name-input"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={person.amount}
                            onChange={(e) =>
                              updatePerson(person.id, "amount", e.target.value)
                            }
                            placeholder="0"
                            min="0"
                            className="table-input amount-input"
                          />
                        </td>
                        <td className="actions-cell">
                          {people.length > 1 && (
                            <button
                              onClick={() => removePerson(person.id)}
                              className="btn-remove-table"
                              title="Xóa người này"
                            >
                              🗑️
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="add-person-section">
                <button onClick={addPerson} className="btn-add">
                  ➕ Thêm người
                </button>
              </div>

              <div className="note">
                💡 <strong>Lưu ý:</strong> Để trống số tiền để chia đều, hoặc
                nhập số tiền mỗi người đặt để chia theo tỷ lệ. Phí ship sẽ được
                tính vào số tiền gốc và áp dụng giảm giá cùng với hàng.
              </div>
            </div>

            <div className="form-actions">
              <button onClick={calculateSplit} className="btn-calculate">
                🧮 Tính toán
              </button>
            </div>
          </div>
        ) : (
          <div className="results-container">
            <div className="results-header">
              <h2>📊 Kết quả chia tiền</h2>
              <button onClick={resetForm} className="btn-reset">
                🔄 Tính lại
              </button>
            </div>

            <div className="summary">
              <div className="summary-item">
                <span>Số tiền hàng:</span>
                <span className="amount">
                  {results.originalTotal.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="summary-item">
                <span>Phí ship:</span>
                <span className="amount shipping">
                  +{results.shippingFee.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="summary-item">
                <span>Tổng gốc (hàng + ship):</span>
                <span className="amount">
                  {results.originalWithShipping.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="summary-item">
                <span>Giảm giá:</span>
                <span className="amount discount">
                  -{results.discountAmount.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="summary-item total">
                <span>Số tiền cuối cùng:</span>
                <span className="amount">
                  {results.finalTotal.toLocaleString("vi-VN")} ₫
                </span>
              </div>
            </div>

            <div className="split-info">
              <p>
                {results.splitType === "equal"
                  ? "✅ Chia đều cho tất cả mọi người"
                  : "📊 Chia theo tỷ lệ số tiền mỗi người đặt"}
              </p>
            </div>

            <div className="people-results">
              <h3>Chi tiết từng người:</h3>
              {results.people.map((person) => (
                <div key={person.id} className="person-result">
                  <div className="person-info">
                    <span className="person-name">{person.name}</span>
                    {results.splitType === "proportional" && (
                      <span className="person-original">
                        (Đặt:{" "}
                        {parseFloat(person.amount || 0).toLocaleString("vi-VN")}{" "}
                        ₫)
                      </span>
                    )}
                  </div>
                  <div className="person-pay">
                    <span className="pay-amount">
                      {person.payAmount.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="total-check">
              <div className="total-check-item">
                <span>Tổng cộng:</span>
                <span className="amount">
                  {results.people
                    .reduce((sum, person) => sum + person.payAmount, 0)
                    .toLocaleString("vi-VN")}{" "}
                  ₫
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

render(<App />, document.getElementById("app"));
