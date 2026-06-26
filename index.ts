const ERR_SCRIPT_LOAD = 'Error communicating with the ad server'

const DOMAIN = process.env.DOMAIN || 'libtl.com'
const SCRIPT_URL = `https://${DOMAIN}/sdk.js`
const HANDLERS: Record<number, (options?: any) => Promise<void>> = {}

export default function createAdHandler (zoneid: number) {
    const mount = typeof document !== 'undefined' ? (document.head || document.body || document.documentElement) : null

    if (!mount) {
        return () => Promise.resolve()
    }

    if (HANDLERS[zoneid]) {
        return HANDLERS[zoneid]
    }

    const script = document.createElement('script')
    const handlerName = `show_${zoneid}`
    let cache: Array<[any, (value: any) => void, (reason?: any) => void]> | null = []
    let loaded = false

    const onLoad = () => {
        loaded = true

        if (cache) {
            cache.forEach((item) => {
                const globalHandler = (window as any)[handlerName]
                if (typeof globalHandler !== 'function') {
                    item[2](new Error(ERR_SCRIPT_LOAD))
                } else {
                    Promise.resolve(globalHandler(item[0])).then(item[1]).catch(item[2])
                }
            })
            cache = null
        }
    }

    const handler = (options?: any) => {
        const globalHandler = (window as any)[handlerName]
        if (typeof globalHandler !== 'function') {
            return new Promise<void>((resolve, reject) => {
                if (loaded) {
                    return reject(new Error(ERR_SCRIPT_LOAD))
                }

                if (cache) {
                    cache.push([options, resolve, reject])
                }
            })
        }

        return Promise.resolve(globalHandler(options))
    }

    script.src = SCRIPT_URL
    script.dataset.zone = String(zoneid)
    script.dataset.sdk = handlerName
    script.async = true

    script.addEventListener('load', onLoad)
    script.addEventListener('error', onLoad)
    mount.appendChild(script)

    HANDLERS[zoneid] = handler

    return handler
}
