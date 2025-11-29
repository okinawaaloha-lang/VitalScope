import React from 'react';
import { AnalysisResult, RecommendedProduct } from '../types';
import { ThumbsUp, ThumbsDown, Info, ShoppingBag, ExternalLink } from 'lucide-react';

interface AnalysisViewProps {
  result: AnalysisResult;
}

const AMAZON_TAG = 'simplemind0f-22';

const AnalysisView: React.FC<AnalysisViewProps> = ({ result }) => {

  const getAmazonSearchUrl = (keyword: string) => {
    const encoded = encodeURIComponent(keyword);
    return `https://www.amazon.co.jp/s?k=${encoded}&tag=${AMAZON_TAG}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3 text-teal-700 font-bold">
          <Info size={20} />
          <h3>AIによる概要解析</h3>
        </div>
        <p className="text-gray-700 leading-relaxed text-sm">
          {result.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pros */}
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold">
            <ThumbsUp size={20} />
            <h3>メリット</h3>
          </div>
          <ul className="space-y-2">
            {result.pros.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
          <div className="flex items-center gap-2 mb-3 text-red-700 font-bold">
            <ThumbsDown size={20} />
            <h3>デメリット・注意点</h3>
          </div>
          <ul className="space-y-2">
            {result.cons.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-red-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ShoppingBag className="text-orange-500" />
          あなたへのおすすめ商品
        </h3>
        <div className="space-y-3">
          {result.recommendations.map((item, idx) => (
            <a
              key={idx}
              href={getAmazonSearchUrl(item.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                   {/* Placeholder image since we can't fetch real Amazon images securely without backend */}
                   <img 
                     src={`https://picsum.photos/seed/${encodeURIComponent(item.name)}/200`} 
                     alt={item.name} 
                     className="w-full h-full object-cover opacity-80"
                   />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 text-sm truncate group-hover:text-orange-600 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {item.reason}
                  </p>
                </div>
                <ExternalLink size={18} className="text-gray-300 group-hover:text-orange-500" />
              </div>
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2 text-right">
          ※Amazonアソシエイトリンクを含みます
        </p>
      </div>
    </div>
  );
};

export default AnalysisView;