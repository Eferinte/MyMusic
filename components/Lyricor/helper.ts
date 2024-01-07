/**
 * 仅支持分钟：秒形式的时间解析
 * @param timeStr
 * @returns
 */
export const timeAnalyzer = (timeStr: string): number => {
  const timePieces = timeStr.split(":");
  return Number(timePieces?.[0] || 0) * 60 + Number(timePieces?.[1] || 0);
};

export interface EnhancedText {
  plainText: string;
  phonetic: string;
}

const PHONETIC_SYMBOL_HEAD = "<@ptc";
const PHONETIC_SYMBOL_END = ">";

export const textEnhanced = (rawText: string): EnhancedText[] => {
  console.log("raw = ", rawText);

  const enhancedList: EnhancedText[] = [];
  let buffer = rawText;
  let phoneticHead = buffer.indexOf(PHONETIC_SYMBOL_HEAD);
  let phoneticEnd = buffer.indexOf(PHONETIC_SYMBOL_END);
  while (
    phoneticHead !== -1 &&
    phoneticHead + PHONETIC_SYMBOL_HEAD.length < phoneticEnd
  ) {
    const phoneticContent = buffer.slice(
      phoneticHead + PHONETIC_SYMBOL_HEAD.length,
      phoneticEnd
    );
    const beforeBuffer = buffer.slice(0, phoneticHead);
    buffer = buffer.slice(phoneticEnd + PHONETIC_SYMBOL_END.length);
    if (!phoneticContent) continue;

    const phoneticLengthStr = /\d+/.exec(phoneticContent)?.[0];
    const phoneticLength = Number(phoneticLengthStr);
    // 注音外的纯文本块
    const restBefore = beforeBuffer.slice(
      0,
      beforeBuffer.length - phoneticLength
    );
    enhancedList.push({ phonetic: "", plainText: restBefore });

    // 被注音文本
    const enhancedText = beforeBuffer.slice(
      beforeBuffer.length - phoneticLength
    );
    // 注音文本
    const phonetic = phoneticContent.replace(phoneticLengthStr, "");
    enhancedList.push({ phonetic, plainText: enhancedText });
    // update next
    phoneticHead = buffer.indexOf(PHONETIC_SYMBOL_HEAD);
    phoneticEnd = buffer.indexOf(PHONETIC_SYMBOL_END);
  }
  enhancedList.push({ phonetic: "", plainText: buffer });
  console.log("enhanced = ", enhancedList);
  // debugger;
  return enhancedList;
};
