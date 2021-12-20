const Card = ({
  category,
  title,
  content,
  photo
}) => (
  <div class="max-w-md mx-auto bg-white rounded-md shadow-lg overflow-hidden md:max-w-1xl">
    <div class="md:flex">
      { photo && <div class="md:shrink-0">
        <img class="h-48 w-full object-cover md:h-full md:w-48" src={ photo } alt="Man looking at item at a store" />
      </div> }
      <div class="p-8">
        <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{ category }</div>
        <h3 class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">{ title }</h3>
        { content && <p class="mt-2 text-gray-500">{ content }</p> }
      </div>
    </div>
  </div>
);

export default Card;
