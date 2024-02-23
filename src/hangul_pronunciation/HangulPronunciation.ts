import { cho, jong, jung } from './hangul';

type Hangul = string[];

type Converted = {
  target: string;
  list: string[];
};

export class hangulPronunciation {
  convertedHangul: Hangul[];
  originalHangul: Hangul[];
  original: string;
  constructor(str: string) {
    this.convertedHangul = this.#decomposeString(str);
    this.originalHangul = this.#decomposeString(str);
    this.original = str;
  }

  pronounce(convertAll: boolean = true): string {
    if (convertAll) {
      this.special1();
      this.modifyJongsung();
    }
    return this.#assemble(this.convertedHangul);
  }

  /**
   * 단어의 초성,중성,종성을 나누는 함수
   * @param str - string
   * @returns Hangul[]
   */
  #decomposeString(str: string): Hangul[] {
    const decomposed = [...str].map((char) => {
      const code = char.charCodeAt(0) - 0xac00;
      if (code >= 0 && code < 11172) {
        const jongIndex = code % 28;
        const jungIndex = ((code - jongIndex) / 28) % 21;
        const choIndex = ((code - jongIndex) / 28 - jungIndex) / 21;
        return [
          cho[choIndex],
          jung[jungIndex],
          ...(jong[jongIndex] ? [jong[jongIndex]] : []),
        ];
      }
      return [char];
    });

    return decomposed;
  }

  /**
   * 초성,중성,종성으로 나누어진 문자열을 다시 합치는 함수
   * @param Hangul[]
   * @returns
   */
  #assemble(convertedHangul: Hangul[]) {
    return convertedHangul
      .map((list) => {
        if (list.length === 1 && list[0] === ' ') {
          return ' '; // 공백 문자 처리
        }
        const choIndex = cho.indexOf(list[0]); // 초성 인덱스
        const jungIndex = jung.indexOf(list[1]); // 중성 인덱스
        let jongIndex = 0; // 종성 인덱스, 기본값은 0(종성 없음)
        if (list.length === 3) {
          jongIndex = jong.indexOf(list[2]); // 종성이 있으면 인덱스 할당
        }
        const code = 0xac00 + (choIndex * 21 + jungIndex) * 28 + jongIndex;
        return String.fromCharCode(code);
      })
      .join('');
  }

  /**
   * 특수 규칙1. 밟,넓 + 자음 은 ㅂ으로 발음된다.
   */
  special1() {
    this.convertedHangul = this.convertedHangul.map((hangul, index) => {
      if (hangul.length === 3) {
        if (
          hangul[0] === 'ㅂ' &&
          hangul[1] === 'ㅏ' &&
          hangul[2] === 'ㄼ' &&
          this.originalHangul[index + 1] != undefined &&
          this.originalHangul[index + 1][0] != ' '
        ) {
          return ['ㅂ', 'ㅏ', 'ㅂ'];
        } else if (
          hangul[0] === 'ㄴ' &&
          hangul[1] === 'ㅓ' &&
          hangul[2] === 'ㄼ' &&
          this.originalHangul[index + 1] != undefined &&
          this.originalHangul[index + 1][0] != ' '
        ) {
          return ['ㄴ', 'ㅓ', 'ㅂ'];
        } else return hangul;
      } else {
        return hangul;
      }
    });
  }

  /**
   * 규칙1. 받침소리로는 'ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅇ'의 7개 자음만 발음한다.
   *
   * 규칙2. 겹받침 ㄳ ㅄ ㄵ ㄼ ㄽ ㄾ 은 앞의 자음으로 발음된다.
   *
   * 규칙3. 겹받침 'ㄺ, ㄻ, ㄿ'은 어말 또는 자음 앞에서 각각 ㄱ, ㅁ, ㅂ 으로 발음한다.
   */
  modifyJongsung() {
    const jongsungs: Converted[] = [
      { list: ['ㅋ', 'ㄲ', 'ㄳ'], target: 'ㄱ' },
      { list: ['ㅅ', 'ㅆ', 'ㅈ', 'ㅊ', 'ㅌ'], target: 'ㄷ' },
      { list: ['ㅍ', 'ㅄ'], target: 'ㅂ' },
      { list: ['ㄵ'], target: 'ㄴ' },
      { list: ['ㄼ', 'ㄽ', 'ㄾ'], target: 'ㄹ' },
    ];

    function modify(jong: string): string {
      return jongsungs.reduce((prev, curr) => {
        return curr.list.includes(jong) ? curr.target : prev;
      }, jong);
    }

    this.convertedHangul = this.convertedHangul.map((hangul) => {
      return hangul.length === 3
        ? [hangul[0], hangul[1], modify(hangul[2])]
        : hangul;
    });
  }
}
