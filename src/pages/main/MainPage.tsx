import React, { useState, useCallback, useEffect } from "react";
import {
  useLazyGetMainProductsQuery,
  useGetFilteredProductsQuery,
} from "../../shared/api/productsApi";
import { Search } from "../../features/search/Search";
import { ProductList } from "../../widgets/product-list/ProductList";
import { Pagination } from "../../features/pagination/Pagination";
import { Loader } from "../../shared/ui/loader/Loader";

// Демо-товары на случай если API не работает
const DEMO_PRODUCTS = [
  {
    id: 1,
    name: "Футболка мужская",
    price: 1500,
    image: "https://via.placeholder.com/300x200/007bff/ffffff?text=Футболка",
    description: "Хлопковая футболка отличного качества",
    category: "Одежда",
  },
  {
    id: 2,
    name: "Женская кофта",
    price: 3500,
    image: "https://via.placeholder.com/300x200/28a745/ffffff?text=Кофта",
    description: "Теплая вязаная кофта",
    category: "Одежда",
  },
];

export const MainPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [mainProducts, setMainProducts] = useState<any[]>(DEMO_PRODUCTS);

  // ЛЕНИВАЯ загрузка основных товаров - только по требованию
  const [
    loadMainProducts,
    { data: apiMainProducts, isLoading: mainLoading, error: mainError },
  ] = useLazyGetMainProductsQuery();

  // Запрос для поиска - ТОЛЬКО когда hasSearched = true
  const {
    data: filteredData,
    isLoading: filteredLoading,
    error: filteredError,
  } = useGetFilteredProductsQuery(
    {
      search: searchTerm,
      page: currentPage,
      per_page: 20,
    },
    {
      skip: !hasSearched || !searchTerm.trim(),
    }
  );

  // Загружаем основные товары только один раз при монтировании
  useEffect(() => {
    const timer = setTimeout(() => {
      loadMainProducts(); // ЯВНЫЙ вызов загрузки
    }, 100);

    return () => clearTimeout(timer);
  }, [loadMainProducts]);

  // Обновляем основные товары когда приходят данные из API
  useEffect(() => {
    if (apiMainProducts && Array.isArray(apiMainProducts)) {
      setMainProducts(apiMainProducts);
    }
  }, [apiMainProducts]);

  const handleSearch = useCallback((term: string) => {
    if (!term.trim()) {
      setHasSearched(false);
      setSearchTerm("");
      return;
    }

    setSearchTerm(term);
    setCurrentPage(1);
    setHasSearched(true);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const isLoading = mainLoading || (hasSearched && filteredLoading);
  const error = mainError || filteredError;

  // Определяем какие товары показывать
  const displayProducts = hasSearched
    ? Array.isArray(filteredData?.products)
      ? filteredData.products
      : []
    : mainProducts;

  const totalPages = hasSearched
    ? Math.ceil((filteredData?.total || 0) / 20)
    : 1;

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#dc3545" }}>
        <h2>Произошла ошибка при загрузке товаров</h2>
        <p>Используются демо-данные для показа работы приложения.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 140px)", paddingTop: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        <Search onSearch={handleSearch} loading={isLoading} />

        {isLoading && <Loader />}

        <ProductList
          products={displayProducts}
          loading={isLoading && displayProducts.length === 0}
        />

        {hasSearched && searchTerm && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};
