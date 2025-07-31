import { describe, it, expect } from 'vitest';
import { aliExpressPatterns } from '../index.js';

describe('AliExpress URL Patterns', () => {
  // テーブル駆動テスト - 境界値テストも含む
  const testCases = [
    // Pattern 0: 日本語商品ページ (/https:\/\/ja\.aliexpress\.com\/item\/\d+\.html/g)
    // 正常系 - 境界値
    { url: 'https://ja.aliexpress.com/item/1.html', patternIndex: 0, shouldMatch: true, description: '最小ID長' },
    { url: 'https://ja.aliexpress.com/item/999999999999999999999999999999999999999.html', patternIndex: 0, shouldMatch: true, description: '非常に長いID' },
    // 正常系 - 通常
    { url: 'https://ja.aliexpress.com/item/1005001234567890.html', patternIndex: 0, shouldMatch: true, description: '通常のID' },
    { url: 'https://ja.aliexpress.com/item/12345.html', patternIndex: 0, shouldMatch: true, description: '5桁のID' },
    { url: 'https://ja.aliexpress.com/item/0.html', patternIndex: 0, shouldMatch: true, description: 'ID=0' },
    // 異常系
    { url: 'https://ja.aliexpress.com/item/.html', patternIndex: 0, shouldMatch: false, description: 'IDなし' },
    { url: 'https://ja.aliexpress.com/item/abc123.html', patternIndex: 0, shouldMatch: false, description: '非数値ID' },
    { url: 'https://ja.aliexpress.com/item/12345.htm', patternIndex: 0, shouldMatch: false, description: '拡張子が.htm' },
    { url: 'https://ja.aliexpress.com/item/', patternIndex: 0, shouldMatch: false, description: 'URLが不完全' },
    { url: 'https://ja.aliexpress.com/items/123.html', patternIndex: 0, shouldMatch: false, description: 'itemsパス' },
    
    // Pattern 1: 短縮URL (/https:\/\/a\.aliexpress\.com\/_\w+(?![\/\w])/g)
    // 正常系 - 境界値
    { url: 'https://a.aliexpress.com/_a', patternIndex: 1, shouldMatch: true, description: '最小トークン長' },
    { url: 'https://a.aliexpress.com/_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', patternIndex: 1, shouldMatch: true, description: '長いトークン' },
    // 正常系 - 通常
    { url: 'https://a.aliexpress.com/_abc123', patternIndex: 1, shouldMatch: true, description: '通常のトークン' },
    { url: 'https://a.aliexpress.com/_xyz789', patternIndex: 1, shouldMatch: true, description: '別の通常トークン' },
    // 異常系
    { url: 'https://a.aliexpress.com/_', patternIndex: 1, shouldMatch: false, description: 'トークンなし' },
    { url: 'https://a.aliexpress.com/', patternIndex: 1, shouldMatch: false, description: 'アンダースコアなし' },
    { url: 'https://a.aliexpress.com/abc123', patternIndex: 1, shouldMatch: false, description: 'アンダースコアで始まらない' },
    { url: 'https://a.aliexpress.com/_abc/def', patternIndex: 1, shouldMatch: false, description: '余分なパス' },
    { url: 'https://a.aliexpress.com/_abc123/', patternIndex: 1, shouldMatch: false, description: '末尾にスラッシュ' },
    
    // Pattern 2: i/形式のURL (/https:\/\/ja\.aliexpress\.com\/i\/\d+\.html/g)
    // 正常系 - 境界値
    { url: 'https://ja.aliexpress.com/i/1.html', patternIndex: 2, shouldMatch: true, description: '最小ID長' },
    { url: 'https://ja.aliexpress.com/i/999999999999999999999999999999999999999.html', patternIndex: 2, shouldMatch: true, description: '非常に長いID' },
    // 正常系 - 通常
    { url: 'https://ja.aliexpress.com/i/1005001234567890.html', patternIndex: 2, shouldMatch: true, description: '通常のID' },
    { url: 'https://ja.aliexpress.com/i/12345.html', patternIndex: 2, shouldMatch: true, description: '5桁のID' },
    { url: 'https://ja.aliexpress.com/i/0.html', patternIndex: 2, shouldMatch: true, description: 'ID=0' },
    // 異常系
    { url: 'https://ja.aliexpress.com/i/.html', patternIndex: 2, shouldMatch: false, description: 'IDなし' },
    { url: 'https://ja.aliexpress.com/i/abc123.html', patternIndex: 2, shouldMatch: false, description: '非数値ID' },
    { url: 'https://ja.aliexpress.com/i/12345.htm', patternIndex: 2, shouldMatch: false, description: '拡張子が.htm' },
    { url: 'https://ja.aliexpress.com/i/', patternIndex: 2, shouldMatch: false, description: 'URLが不完全' },
    { url: 'https://ja.aliexpress.com/is/123.html', patternIndex: 2, shouldMatch: false, description: 'isパス' },
  ];

  it.each(testCases)(
    'Pattern $patternIndex: $description - URL: $url',
    ({ url, patternIndex, shouldMatch }) => {
      const pattern = aliExpressPatterns[patternIndex];
      const match = url.match(pattern);
      
      if (shouldMatch) {
        expect(match).not.toBeNull();
        expect(match).toContain(url);
      } else {
        expect(match).toBeNull();
      }
    }
  );
});