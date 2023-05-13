import * as FUF from './functions-browser.js';

/**
 * Wires up FileUtil functions on the plugin eventbus.
 *
 * @param {object} ev - PluginInvokeEvent - The plugin event.
 *
 * @see https://www.npmjs.com/package/@typhonjs-plugin/manager
 */
export function onPluginLoad(ev)
{
   const eventbus = ev.eventbus;

   const guard = true;
   const type = 'sync'

   eventbus.on(`typhonjs:utils:file:path:common`, FUF.commonPath, void 0, { guard, type });
   eventbus.on(`typhonjs:utils:file:path:common:mapped`, FUF.commonMappedPath, void 0, { guard, type });
   eventbus.on(`typhonjs:utils:file:sort:path`, FUF.pathSort, void 0, { guard, type });
}
