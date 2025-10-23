import { render } from "preact";
import { useState, useEffect } from "preact/hooks";
import "./style.css";

function App() {
  const [currentPage, setCurrentPage] = useState("main"); // "main" hoặc "history"
  const [originalAmount, setOriginalAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [shippingFee, setShippingFee] = useState("");
  const [people, setPeople] = useState([{ id: 1, name: "Người 1", amount: 0 }]);
  const [results, setResults] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);

  // Load lịch sử từ localStorage khi component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("splitBillHistory");
    if (savedHistory) {
      try {
        setPaymentHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Lỗi khi load lịch sử:", error);
      }
    }
  }, []);

  // Lưu kết quả thanh toán vào localStorage
  const savePaymentResult = (result) => {
    const newHistoryItem = {
      id: Date.now(),
      timestamp: new Date().toLocaleString("vi-VN"),
      ...result,
    };

    const updatedHistory = [newHistoryItem, ...paymentHistory].slice(0, 5); // Giữ tối đa 5 lần
    setPaymentHistory(updatedHistory);

    try {
      localStorage.setItem("splitBillHistory", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Lỗi khi lưu lịch sử:", error);
    }
  };

  // Xóa một lịch sử cụ thể
  const deleteHistoryItem = (id) => {
    const updatedHistory = paymentHistory.filter((item) => item.id !== id);
    setPaymentHistory(updatedHistory);

    try {
      localStorage.setItem("splitBillHistory", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Lỗi khi xóa lịch sử:", error);
    }
  };

  // Xóa toàn bộ lịch sử
  const clearAllHistory = () => {
    setPaymentHistory([]);
    try {
      localStorage.removeItem("splitBillHistory");
    } catch (error) {
      console.error("Lỗi khi xóa toàn bộ lịch sử:", error);
    }
  };

  // Xử lý focus vào input số tiền hàng
  const handleOriginalAmountFocus = (e) => {
    e.target.select();
    // Nếu giá trị là 0, xóa để trống
    if (e.target.value === "0") {
      setOriginalAmount("");
    }
  };

  // Xử lý focus vào input phí ship
  const handleShippingFeeFocus = (e) => {
    e.target.select();
    // Nếu giá trị là 0, xóa để trống
    if (e.target.value === "0") {
      setShippingFee("");
    }
  };

  // Xử lý focus vào input số tiền cuối cùng
  const handleFinalAmountFocus = (e) => {
    e.target.select();
    // Nếu giá trị là 0, xóa để trống
    if (e.target.value === "0") {
      setFinalAmount("");
    }
  };

  // Xử lý focus vào input số tiền của người
  const handlePersonAmountFocus = (personId, e) => {
    e.target.select();
    // Nếu giá trị là 0, xóa để trống
    if (e.target.value === "0") {
      updatePerson(personId, "amount", "");
    }
  };

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
      const result = {
        originalTotal: original,
        shippingFee: shipping,
        originalWithShipping,
        discountAmount,
        finalTotal: final,
        people: newPeople,
        splitType: "equal",
      };
      setResults(result);
      // Tự động lưu kết quả
      savePaymentResult(result);
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
      const result = {
        originalTotal: original,
        shippingFee: shipping,
        originalWithShipping,
        discountAmount,
        finalTotal: final,
        people: newPeople,
        splitType: "proportional",
      };
      setResults(result);
      // Tự động lưu kết quả
      savePaymentResult(result);
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
        <nav className="nav">
          <button
            onClick={() => setCurrentPage("main")}
            className={`nav-btn ${currentPage === "main" ? "active" : ""}`}
          >
            🏠 Trang chính
          </button>
          <button
            onClick={() => setCurrentPage("history")}
            className={`nav-btn ${currentPage === "history" ? "active" : ""}`}
          >
            📋 Lịch sử ({paymentHistory.length})
          </button>
        </nav>
      </header>

      <main className="main">
        {currentPage === "history" ? (
          <div className="history-container">
            <div className="history-header">
              <h2>📋 Lịch sử thanh toán</h2>
              {paymentHistory.length > 0 && (
                <button onClick={clearAllHistory} className="btn-clear-all">
                  🗑️ Xóa tất cả
                </button>
              )}
            </div>

            {paymentHistory.length === 0 ? (
              <div className="empty-history">
                <p>📝 Chưa có lịch sử thanh toán nào</p>
                <p>Hãy tính toán và lưu kết quả để xem lịch sử ở đây!</p>
              </div>
            ) : (
              <div className="history-list">
                {paymentHistory.map((item) => (
                  <div key={item.id} className="history-item">
                    <div className="history-item-header">
                      <div className="history-info">
                        <span className="history-date">{item.timestamp}</span>
                        <span className="history-total">
                          Tổng: {item.finalTotal.toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="btn-delete-item"
                        title="Xóa lịch sử này"
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="history-summary">
                      <div className="summary-row">
                        <span>Số tiền hàng:</span>
                        <span>
                          {item.originalTotal.toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                      <div className="summary-row">
                        <span>Phí ship:</span>
                        <span>
                          +{item.shippingFee.toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                      <div className="summary-row">
                        <span>Giảm giá:</span>
                        <span className="discount">
                          -{item.discountAmount.toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                      <div className="summary-row total">
                        <span>Số tiền cuối:</span>
                        <span>{item.finalTotal.toLocaleString("vi-VN")} ₫</span>
                      </div>
                    </div>

                    <div className="history-split-info">
                      <p>
                        {item.splitType === "equal"
                          ? "✅ Chia đều cho tất cả mọi người"
                          : "📊 Chia theo tỷ lệ số tiền mỗi người đặt"}
                      </p>
                    </div>

                    <div className="history-people">
                      <h4>Chi tiết từng người:</h4>
                      {item.people.map((person) => (
                        <div key={person.id} className="history-person">
                          <span className="person-name">{person.name}</span>
                          {item.splitType === "proportional" && (
                            <span className="person-original">
                              (Đặt:{" "}
                              {parseFloat(person.amount || 0).toLocaleString(
                                "vi-VN"
                              )}{" "}
                              ₫)
                            </span>
                          )}
                          <span className="person-pay">
                            {person.payAmount.toLocaleString("vi-VN")} ₫
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : !results ? (
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
                  onFocus={handleOriginalAmountFocus}
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
                  onFocus={handleShippingFeeFocus}
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
                  onFocus={handleFinalAmountFocus}
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
                            onFocus={(e) =>
                              handlePersonAmountFocus(person.id, e)
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
              <div className="results-actions">
                <button onClick={resetForm} className="btn-reset">
                  🔄 Tính lại
                </button>
              </div>
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
              <p className="auto-save-notice">
                💾 Kết quả đã được tự động lưu vào lịch sử
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
