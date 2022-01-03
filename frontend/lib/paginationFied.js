import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    // keyArgs: false,
    read(existing = [], { args, cache }) {
      // console.log(existing, args, cache);
      const { skip, first } = args;

      // Read the number of items on the page from the cache
      const data = cache.readQuery({
        query: PAGINATION_QUERY,
      });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);
      // Check if we have existing items
      const items = existing
        .slice(skip, skip + first)
        .filter((x) => x);

      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // No items, so we need to fetch em from BE
        return false;
      }

      // If there are items, return from cache
      if (items.length) {
        // console.log(
        //   `There are ${items.length} items in the chache, send em to APollo`
        // );
        return items;
      }

      return false;
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // This runs when Apollo comes from the network with our products
      // console.log(
      //   `Merging items from the network ${incoming.length}`
      // );
      const merged = existing ? existing.slice(0) : [];
      // merged.push(incoming);
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // console.log(merged);
      // return merged items from cache, and do read function again
      return merged;
    },
  };
}
