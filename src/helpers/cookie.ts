const cookie = {
  read(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    // decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码。
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
