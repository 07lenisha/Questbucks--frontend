import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listRedemptions, redeemCode, clearMessages } from '../slices/RedeemSlice';

const SearchRedemptions = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.redeem);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRedemptions, setFilteredRedemptions] = useState([]);
  const [redeemingCode, setRedeemingCode] = useState(null);
  const [redeemSuccessCodes, setRedeemSuccessCodes] = useState({});

  const handleSearch = async (e) => {
    e.preventDefault();
    dispatch(clearMessages());
    setRedeemSuccessCodes({});
    if (!searchTerm.trim()) {
      setFilteredRedemptions([]);
      return;
    }
    try {
      const resultAction = await dispatch(listRedemptions());
      if (listRedemptions.fulfilled.match(resultAction)) {
        const loweredSearch = searchTerm.toLowerCase().trim();
        const filtered = resultAction.payload.filter(r => {
          const user = r.user_id || {};
          const email = user.email?.toLowerCase() || '';
          const name = user.name?.toLowerCase() || '';
          return email === loweredSearch || name === loweredSearch;
        });
        setFilteredRedemptions(filtered);
      }
    } catch {
      setFilteredRedemptions([]);
    }
  };

  const handleRedeem = async (code) => {
    dispatch(clearMessages());
    setRedeemingCode(code);
    const resultAction = await dispatch(redeemCode(code));
    setRedeemingCode(null);

    if (redeemCode.fulfilled.match(resultAction)) {
      
      setFilteredRedemptions(prev =>
        prev.map(r =>
          r.redemption_code === code ? { ...r, redeemed: true, status: 'redeemed' } : r
        )
      );
      setRedeemSuccessCodes(prev => ({
        ...prev,
        [code]: `🎉 Code "${code}" redeemed successfully! Enjoy your reward!`
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Search Your Redemptions</h2>

      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by exact email or name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded-lg text-white font-semibold
            ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="mb-4 text-red-600 font-medium">{error}</p>}

      {filteredRedemptions.length > 0 ? (
        <ul className="space-y-5">
          {filteredRedemptions.map((r) => {
            const isRedeemed = r.redeemed || r.status?.toLowerCase() === 'redeemed';
            return (
              <li
                key={r._id}
                className="flex justify-between items-center border border-gray-200 rounded-lg p-5 shadow-sm"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-900 mb-1">
                    Code: <span className="font-mono">{r.redemption_code}</span>
                  </p>
                  <p className="text-gray-700 mb-1">
                    Quiz: <span className="font-medium">{r.quizId?.title || 'N/A'}</span>
                  </p>
                  <p className="text-gray-700 mb-1">
                    Status: <span className={`font-semibold ${isRedeemed ? 'text-green-600' : 'text-yellow-600'}`}>
                      {isRedeemed ? 'Redeemed' : r.status}
                    </span>
                  </p>
                  <p className="text-gray-700">Points: <span className="font-medium">{r.points_earned}</span></p>
                </div>

                <div className="flex flex-col items-end">
                  {!isRedeemed && (
                    <button
                      onClick={() => handleRedeem(r.redemption_code)}
                      disabled={loading || redeemingCode === r.redemption_code}
                      className={`px-5 py-2 rounded-lg font-semibold text-white
                        ${redeemingCode === r.redemption_code ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                      {redeemingCode === r.redemption_code ? 'Redeeming...' : 'Redeem'}
                    </button>
                  )}
                  {redeemSuccessCodes[r.redemption_code] && (
                    <p className="mt-2 text-sm text-green-700 font-medium max-w-xs text-center">
                      {redeemSuccessCodes[r.redemption_code]}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        searchTerm && <p className="text-gray-500 italic mt-8 text-center">No redemptions found for &quot;{searchTerm}&quot;</p>
      )}
    </div>
  );
};

export default SearchRedemptions;
