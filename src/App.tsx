import React, { useEffect, useRef, useState } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import ProductService from "./helpers/ProductService";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string | null;
  date_start: number | null;
  date_end: number | null;
}

const App: React.FC = () => {
  const op = useRef<OverlayPanel>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [searchInput, setSearchInput] = useState("");

  const columns = [
    { field: "title", header: "Title" },
    { field: "place_of_origin", header: "Place of Origin" },
    { field: "artist_display", header: "Artist" },
    { field: "inscriptions", header: "Inscriptions" },
    { field: "date_start", header: "Start Date" },
    { field: "date_end", header: "End Date" },
  ];

  const productService = new ProductService();

  // Fetch artworks based on current page and rows
  const fetchArtworks = async (page: number) => {
    setLoading(true);
    const { artworks, total } = await productService.getArtworks(page, rows);
    setArtworks(artworks);
    setTotalRecords(total);
    setLoading(false);
  };

  useEffect(() => {
    fetchArtworks(currentPage);
  }, [currentPage, rows]);

  const dynamicColumns = columns.map((col) => <Column key={col.field} field={col.field} header={col.header} />);

  // Handle page changes
  const onPageChange = (event: any) => {
    const newPage = Math.floor(event.first / event.rows) + 1;
    setCurrentPage(newPage);
    setRows(event.rows);
  };

  const onSubmit = async () => {
    // Parse the input value as a number
    const numberOfRows = Number(searchInput);

    if (isNaN(numberOfRows) || numberOfRows <= 0) {
      console.error("Invalid number of rows");
      return;
    }

    let selectedRows: Artwork[] = [];
    let pagesToFetch = Math.ceil(numberOfRows / rows);

    // Fetch rows from all pages
    for (let i = 1; i <= pagesToFetch; i++) {
      const { artworks: pageArtworks } = await productService.getArtworks(i, rows);
      selectedRows = [...selectedRows, ...pageArtworks];

      // Stop if we have selected enough rows
      if (selectedRows.length >= numberOfRows) break;
    }

    // Select only the number of rows specified by the user
    selectedRows = selectedRows.slice(0, numberOfRows);

    setSelectedArtworks(selectedRows); // Set selected artworks
    op.current?.hide();
  };

  return (
    <div>
      <div className="page-title">
        <h1>Artworks DataTable made by Utkarsh Kushwaha</h1>
        <p>A dynamic table showcasing artwork details with seamless pagination, selection features.</p>
      </div>

      <div className="custom-artwork-table">
        <div className="custom-select-trigger">
          <Button icon="pi pi-chevron-down" className="trigger-button" text onClick={(e) => op.current?.toggle(e)} />
          <OverlayPanel ref={op}>
            <div className="custom-select-box">
              <InputText
                placeholder="Select rows..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <div className="custom-select-box-footer">
                <Button label="Close" size="small" onClick={onSubmit} severity="danger" outlined />
                <Button label="Submit" size="small" onClick={onSubmit} />
              </div>
            </div>
          </OverlayPanel>
        </div>

        <DataTable
          size="small"
          className="artwork-table-wrapper"
          value={artworks}
          paginator
          selection={selectedArtworks}
          onSelectionChange={(e: any) => setSelectedArtworks(e.value)}
          onPage={onPageChange}
          first={(currentPage - 1) * rows} // Calculate the starting index
          rows={rows}
          rowsPerPageOptions={[10, 20, 50]}
          totalRecords={totalRecords}
          lazy
          loading={loading}
          selectionMode="multiple" // Add this line
        >
          <Column selectionMode="multiple" style={{ width: "4rem" }} />
          {dynamicColumns}
        </DataTable>
      </div>
    </div>
  );
};

export default App;
