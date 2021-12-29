import * as FUF from './index.js';

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

   const options = ev.pluginOptions;

   let guard = true;

   // Apply any plugin options.
   if (typeof options === 'object')
   {
      if (typeof options.guard === 'boolean') { guard = options.guard; }
   }

   eventbus.on(`typhonjs:utils:file:dir:walk`, FUF.walkDir, void 0, { guard });
   eventbus.on(`typhonjs:utils:file:file:has`, FUF.hasFile, void 0, { guard });
   eventbus.on(`typhonjs:utils:file:files:walk`, FUF.walkFiles, void 0, { guard });
   eventbus.on(`typhonjs:utils:file:list:dir:get`, FUF.getDirList, void 0, { guard });
   eventbus.on(`typhonjs:utils:file:list:file:get`, FUF.getFileList, void 0, { guard });
   eventbus.on(`typhonjs:utils:file:path:common`, FUF.commonPath, void 0, { guard });
   eventbus.on(`typhonjs:utils:file:path:common:mapped`, FUF.commonMappedPath, void 0, { guard });
   eventbus.on(`typhonjs:utils:file:path:relative:get`, FUF.getRelativePath, void 0, { guard });
   eventbus.on(`typhonjs:utils:file:sort:path`, FUF.pathSort, void 0, { guard });
   eventbus.on(`typhonjs:utils:file:url:path:dir:get`, FUF.getURLDirpath, void 0, { guard });
   eventbus.on(`typhonjs:utils:file:url:path:file:get`, FUF.getURLFilepath, void 0, { guard });
}
