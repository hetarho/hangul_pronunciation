import { hangulPronunciation } from '../hangul_pronunciation/HangulPronunciation';

describe('hangulPronunciation', () => {
  describe('받힘 테스트', () => {
    it('홑받힘 변환', () => {
      const hp = new hangulPronunciation('갂 갘 갓 갔 갖 갗 같 갚');
      const result = hp.pronounce();
      expect(result).toBe('각 각 갇 갇 갇 갇 갇 갑');
    });

    it('겹받힘 변환', () => {
      const hp = new hangulPronunciation('갃 갅 갋 갌 갍 값');
      const result = hp.pronounce();
      expect(result).toBe('각 간 갈 갈 갈 갑');
    });

    it('겹받힘 변환2', () => {
      const hp = new hangulPronunciation('밟다 넓다');
      const result = hp.pronounce();
      expect(result).toBe('발따 널따');
    });
  });

  // it('거짓말 => 거진말', () => {
  //   hp = new hangulPronunciation('거짓말');
  //   const result = hp.pronounce();
  //   expect(result).toBe('거진말');
  // });

  // it('생년월일 => 생녀눠릴', () => {
  //   hp = new hangulPronunciation('생년월일');
  //   const result = hp.pronounce();
  //   expect(result).toBe('생녀눠릴');
  // });
});
