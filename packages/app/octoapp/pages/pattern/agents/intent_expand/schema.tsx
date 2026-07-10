const intentExpandSchema = {
  type: "object",
  properties: {
    originalInput: {
      type: "string",
      description: "用户的原始输入"
    },
    isSimple: {
      type: "boolean",
      description: "用户意图是否过于简单需要扩展"
    },
    expandedText: {
      type: "string",
      description: "扩展后的完整纯文本描述，仅在isSimple为true时提供；足够详细时直接返回用户原文"
    }
  },
  required: ["originalInput", "isSimple", "expandedText"]
}

export default intentExpandSchema
