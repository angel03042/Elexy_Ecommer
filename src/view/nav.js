export const nav = `<p class="text-white text-2xl font-mono">Elexy</p>
        <div class="group">
          <div class="relative w-50 md:w-60 xl:w-100 h-10">
            <input id="search" class="bg-white w-full h-full absolute z-10 pe-10 pl-4 focus:border-1" type="text" name="searh" placeholder="Buscar productos">
            <div id="btnBuscar" class="absolute block z-20 right-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
            </div>
          </div>
          <div class="relative invisible">
            <div id="containerSearch" class="absolute flex flex-col z-10 bg-white w-full py-4 text-sm text-gray-600">
              
            </div>
          </div>
        </div>`;
