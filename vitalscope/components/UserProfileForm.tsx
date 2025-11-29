import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Save, User } from 'lucide-react';

interface UserProfileFormProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  isEditing?: boolean;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ initialProfile, onSave, isEditing = false }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  // Sync state if initialProfile changes (e.g. loading from local storage)
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3 text-teal-600">
          <User size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {isEditing ? 'プロフィールの設定' : 'まずはあなたのことを\n教えてください'}
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          最適なアドバイスをするために必要です。<br/>この情報はアプリ内のみに保存されます。
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">年齢</label>
          <input
            type="number"
            required
            placeholder="例: 35"
            value={profile.age}
            onChange={(e) => setProfile({ ...profile, age: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-200 bg-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">性別</label>
          <div className="flex gap-3">
            {[
              { val: 'male', label: '男性' },
              { val: 'female', label: '女性' },
              { val: 'other', label: 'その他' }
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setProfile({ ...profile, gender: opt.val as any })}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                  profile.gender === opt.val
                    ? 'bg-teal-500 text-white border-teal-500 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">現在の健康状態・悩み・目標</label>
          <textarea
            required
            rows={5}
            value={profile.healthContext}
            onChange={(e) => setProfile({ ...profile, healthContext: e.target.value })}
            placeholder="例：最近、健康診断で血圧が高いと言われたので塩分を控えたいです。また、デスクワークが多く運動不足気味です。週末は軽くジムに通っていますが、ダイエットも兼ねて効率よく筋肉をつけたいと考えています。アレルギーはありません。"
            className="w-full p-3 rounded-xl border border-gray-200 bg-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-sm leading-relaxed resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {isEditing ? '設定を保存する' : '始める'}
        </button>
      </div>
    </form>
  );
};

export default UserProfileForm;